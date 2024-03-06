import { log } from './logger'
// import { OS } from '../typings/xpcom'

// https://searchfox.org/mozilla-central/source/toolkit/modules/subprocess/subprocess_win.jsm#135 doesn't seem to work on Windows.
export async function findBinary(bin: string, installationDirectory: { mac?: string[], win?: string[] } = {}): Promise<string> {
  const pref = `translators.better-bibtex.path.${bin}`
  let location: string = Zotero.Prefs.get(pref)
  if (location && (await OS.File.exists(location))) return location
  location = await pathSearch(bin, installationDirectory)
  if (typeof location === 'string') Zotero.Prefs.set(pref, location)
  return location
}

async function* asyncGenerator<T>(array: T[]): AsyncGenerator<T, void, unknown> {
  for (const item of array) {
    yield await Promise.resolve(item)
  }
}

function expandWinVars(value: string): string {
  const env = Components.classes['@mozilla.org/process/environment;1'].getService(Components.interfaces.nsIEnvironment)
  let more = true
  while (more) {
    more = false
    value = value.replace(/%([A-Z][A-Z0-9]*)%/ig, (match, variable) => {
      more = true
      return env.get(variable) as string
    })
  }
  return value
}

async function pathSearch(bin: string, installationDirectory: { mac?: string[], win?: string[] } = {}): Promise<string> {
  const env = Components.classes['@mozilla.org/process/environment;1'].getService(Components.interfaces.nsIEnvironment)

  let paths: string[] = env.get('PATH').split(Zotero.isWin ? ';' : ':')
  if (Zotero.isWin) paths = paths.map(expandWinVars)
  if (Zotero.isWin && installationDirectory.win) paths.unshift(...(installationDirectory.win))
  if (Zotero.isMac && installationDirectory.mac) paths.unshift(...(installationDirectory.mac))
  paths = paths.filter(p => p)
  if (!paths.length) {
    log.error('pathSearch: PATH not set')
    return ''
  }

  const extensions: string[] = Zotero.isWin ? env.get('PATHEXT').split(';').filter((e: string) => e.match(/^[.].+/)) : ['']
  if (Zotero.isWin && !extensions.length) {
    log.error('pathSearch: PATHEXT not set')
    return ''
  }

  log.debug('pathSearch: looking for', bin, 'in', paths, extensions)

  for await (const path of asyncGenerator(paths)) {
    for (const ext of extensions) {
      try {
        const exe: string = OS.Path.join(path, bin + ext)
        if (!(await OS.File.exists(exe))) continue

        // eslint-disable-next-line @typescript-eslint/await-thenable
        const stat = await OS.File.stat(exe)
        if (stat.isDir) continue

        // eslint-disable-next-line no-bitwise
        if (!Zotero.isWin && (stat.unixMode & 111) === 0) { // bit iffy -- we don't know if *we* can execute this.
          log.error(`pathSearch: ${exe} exists but has mode ${(stat.unixMode).toString(8)}`)
          continue
        }

        log.debug(`pathSearch: ${bin} found at ${exe}`)
        return exe
      }
      catch (err) {
        log.error('pathSearch:', err)
      }
    }
  }
  log.debug('pathSearch:', bin, 'not found in', env.path)
  return ''
}
