-citation-key = Citation key
better-bibtex_auto-export_delete = Cancellazione esportazione automatica
better-bibtex_auto-export_delete_confirm = Sei sicuro di voler cancellare questa esportazione automatica? L'operazione è irreversibile.
better-bibtex_aux-scan_prompt = Nome tag
better-bibtex_aux-scan_title_aux = Tagga gli elementi citati da un file AUX
better-bibtex_aux-scan_title_md = Tagga gli elementi citati da un file Markdown
better-bibtex_aux-scanner = Analizza file BibTeX AUX/Markdown per citazioni bibliografiche...
better-bibtex_bulk-keys-confirm_warning = Stai modificando più di { $treshold } elementi. Vuoi procedere?
better-bibtex_bulk-keys-confirm_stop_asking = Sì, e non chiederlo più
better-bibtex_citekey_pin = Fissa chiave BibTeX
better-bibtex_citekey_set = Cambia chiave BibTeX...
better-bibtex_citekey_set_change = Chambia la chiave BibTeX in
better-bibtex_citekey_set_toomany = Si può cambiare una sola chiave alla volta
better-bibtex_error-report = 
    .title = Better BibTeX log di debug
better-bibtex_error-report_better-bibtex_cache = Dimensioni cache: { $entries } voci.
better-bibtex_error-report_better-bibtex_oom = Zotero ha esaurito la memoria! Zotero su Windows ha delle limitazioni nell'uso della memoria che saranno migliorate con Zotero 7. Nel frattempo, disattivare il caching di Better BibTeX e riavviare Zotero.
    .value = { better-bibtex_error-report_better-bibtex_oom }
better-bibtex_error-report_better-bibtex_current = La versione in uso di Better BibTeX è { $version }
better-bibtex_error-report_better-bibtex_latest = L'ultima versione disponibile di Better BibTeX è { $version }
better-bibtex_error-report_context = 
    .label = Contesto dell'applicazione
better-bibtex_error-report_debug = 
    .label = Log di debug
better-bibtex_error-report_enable-debug = Il log di debug di Zotero è disabilitato. Sarà più facile diagnosticare il problema se lo si abilita prima di tentare l'invio di un log di debug.
better-bibtex_error-report_errors = 
    .label = Errori
better-bibtex_error-report_include-errors = 
    .label = Include error messages
better-bibtex_error-report_include-log = 
    .label = Include debug log
better-bibtex_error-report_include-items = 
    .label = Include item
better-bibtex_error-report_include-notes = 
    .label = notes
better-bibtex_error-report_include-cache = 
    .label = cache
better-bibtex_error-report_include-attachments = 
    .label = attachment metadata
better-bibtex_error-report_items = 
    .label = Elementi
better-bibtex_error-report_not-reviewed = I log di debug non possono essere utilizzati se non sono indicati con il loro ID nell'Issue tracker di Github.
better-bibtex_error-report_post-to-git-hub = Si prega di scrivere un messaggio nell'Issue tracker (https://github.com/retorquere/zotero-better-bibtex/issues) con l'ID del log di debug, una descrizione del problema e tutti i passaggi necessari a riprodurlo.
better-bibtex_error-report_report-id = ID del log di debug:
better-bibtex_error-report_restart-with-logging-enabled = 
    .label = Riavvio con log abilitato…
better-bibtex_error-report_review =
    The data below is about to submitted to Better BibTeX for debugging. You can preview the data here, or save a copy of the log to get the precise data about to be sent, to see whether there's sensitive information that you do not wish to send. Please think carefully about whether unchecking options below is necessary for your environment. We will generally needs more communication (= time) if you remove parts of the log this way.
    
    If you are OK with sending this data, please proceed to the next screen where you will be presented a red debug ID, and post this ID on the issue tracker at
    
    https://github.com/retorquere/zotero-better-bibtex/issue
better-bibtex_error-report_save = 
    .label = Save copy of log for inspection
better-bibtex_error-report_submission-in-progress = Si prega di attendere mentre il log viene inviato.
better-bibtex_error-report_submitted = Il log di debug è stato inviato.
better-bibtex_export-options_keep-updated = Mantieni aggiornato
better-bibtex_export-options_reminder = Si è sicuri di non volere il formato '{ $translator }' ?
better-bibtex_export-options_worker = Esportazione in background
better-bibtex_export-options_biblatexAPA = biblatex-apa
better-bibtex_export-options_biblatexChicago = biblatex-chicago
better-bibtex_item-pane_section_sidenav = 
    .tooltip = { -citation-key }
better-bibtex_item-pane_section_header = 
    .label = { -citation-key }
better-bibtex_item-pane_info_citation-key = 
    .label = { -citation-key }
better-bibtex_preferences_advanced_export_brace-protection = 
    .label = Includi le parole in maiuscolo tra graffe per preservare i caratteri così come scritti
better-bibtex_preferences_advanced_export_brace-protection_warning = Se si vuole ignorare sia le buone pratiche di BibTeX/BibLaTeX (vedi le FAQ di BBT) e le raccomandazioni di Zotero sulle maiuscole, si può disattivare questa opzione per prevenire la protezione con graffe delle parole in maiuscolo.
better-bibtex_preferences_advanced_export_retain-cache = 
    .label = Mantieni la cache delle esportazioni tra gli aggiornamenti
better-bibtex_preferences_advanced_export_retain-cache_warning =
    Di default BBT cancella tutte le cache ogni volta che BBT o Zotero sono aggiornati. Poiché non è possibile prevedere quando una modifica in Zotero o in BBT andrà a cambiare l'output generato a partire da un elemento, le cache sono eliminate ogni volta che viene rilevata una nuova versione di uno dei due, così da assicurare che vengano usate le ultime modifiche che riguardano le esportazioni. Tuttavia, se si è in possesso di una libreria molto grande di cui si esporta frequentemente porzioni significative, si può desiderare di mantenere gli elementi nella cache, anche se ciò espone al rischio di non usufruire dei miglioramenti introdotti con gli aggiornamenti più recenti.
    
    Se si riscontra un problema con questa opzione attiva, è necessario cancellare la cache e provare a riprodurre il problema. Il cambiamento di questa opzione causerà la cancellazione della cache.
better-bibtex_preferences_advanced_export_title-case = 
    .label = Scrivi i titoli con ogni iniziale maiuscola
better-bibtex_preferences_advanced_export_title-case_warning = Se si vuole ignorare sia le buone pratiche di BibTeX/BibLaTeX (vedi le FAQ di BBT) e le raccomandazioni di Zotero sulle maiuscole, si può disattivare questa opzione per evitare di applicare l'iniziale maiuscola a tutte le parole negli elementi in inglese.
better-bibtex_preferences_advanced_export_workers_cache = 
    .label = Attiva la cache per le esportazioni in background
better-bibtex_preferences_advanced_extra-merge = Quando unisci degli elementi, unisci anche:
    .label = { better-bibtex_preferences_advanced_extra-merge }
better-bibtex_preferences_advanced_extra-merge-csl = 
    .label = campi che sono riconosciuti come campi CSL da Zotero
better-bibtex_preferences_advanced_extra_merge-citekeys = 
    .label = le loro chiavi di citazione in un campo `ids` per bib(la)tex
better-bibtex_preferences_advanced_extra_merge-tex = 
    .label = i loro campi `tex.*`
better-bibtex_preferences_advanced_ideographs = Ideographs in citekeys
    .label = { better-bibtex_preferences_advanced_ideographs }
better-bibtex_preferences_advanced_ideographs_jieba = 
    .label = Attiva i filtri 'jieba'/'pinyin' negli schemi delle chiavi di citazione. Usa molta memoria.
better-bibtex_preferences_advanced_ideographs_kuroshiro = 
    .label = Applica la conversione in caratteri romani kuroshiro nei nomi/titoli giapponesi. Usa molta memoria.
better-bibtex_preferences_advanced_import_case-protection = Stabilisci la protezione delle maiuscole per le parentesi graffe:
better-bibtex_preferences_advanced_import_case-protection_as-needed = minimo
    .label = { better-bibtex_preferences_advanced_import_case-protection_as-needed }
better-bibtex_preferences_advanced_import_case-protection_off = no
    .label = { better-bibtex_preferences_advanced_import_case-protection_off }
better-bibtex_preferences_advanced_import_case-protection_on = sì
    .label = { better-bibtex_preferences_advanced_import_case-protection_on }
better-bibtex_preferences_advanced_import_case-protection_warning =
    Durante l'importazione, BBT applicherà una protezione delle maiuscole (<span class="nocase">...<span>) ai titoli con delle parole tra { "{" }Graffe{ "}" }.
    
    Molti file bib(la)tex usano questa funzione troppo spesso e ciò potrebbe produrre dei risultati in HTML non piacevoli, anche se è l'uso previsto da bib(la)tex per le graffe, ed è supportato da Zotero.
    
    Con l'opzione disattivata le parentesi sono ignorate durante l'importazione . Quando è selezionato 'sì' tutte le graffe interpretate da bib(la)tex come protezione delle maiuscole (non tutte lo sono), saranno convertite in un elemento `span`. In modalità `minima`, viene minimizzato il numero di elementi `span`.
better-bibtex_preferences_advanced_import_sentence-case = Solo prima iniziale maiuscola nelle importazioni:
better-bibtex_preferences_advanced_import_sentence-case_off = 
    .label = no (importa i titoli così come sono)
better-bibtex_preferences_advanced_import_sentence-case_on = 
    .label = sì
better-bibtex_preferences_advanced_import_sentence-case_on-guess = 
    .label = sì, ma cerca di escludere titoli che hanno già solo la prima iniziale maiuscola
better-bibtex_preferences_advanced_import_sentence-case_warning =
    le voci in Bib(La)TeX devono essere memorizzate con le iniziali maiuscole di ciascuna parola; Zotero suppone che gli elementi siano inseriti con solo l'iniziale della prima parola in maiuscolo.
    
    Con questa opzione attivata, BBT proverà a modificare l'iniziale della prima parola in maiuscolo. Questa operazione usa procedure euristiche, non c'è un'analisi del linguaggio naturale, e i risultati non sono perfetti.
    
    Si può disattivare questa opzione, ma allora è consigliabile anche disattivare 'Scrivi i titoli con ogni iniziale maiuscola' (che ha altri problemi, vedi l'aiuto di quella opzione in questa pagina).
    Con 'sì, ma cerca di escludere titoli che hanno già solo la prima iniziale maiuscola, BBT proverà a individuare quei titoli che sono già scritti con solo l'iniziale della prima parola maiuscola, e importarli così come sono.
better-bibtex_preferences_advanced_import_migrate = Migrate BetterBibTeX preferences/citation keys
better-bibtex_preferences_advanced_import_export-prefs = 
    .label = Export BetterBibTeX preferences...
better-bibtex_preferences_advanced_import_prefs = 
    .label = Import BetterBibTeX preferences/citation keys...
better-bibtex_preferences_advanced_tab_postscript = postscript
    .label = { better-bibtex_preferences_advanced_tab_postscript }
better-bibtex_preferences_advanced_tab_strings = Definizioni delle variabili @string
    .label = { better-bibtex_preferences_advanced_tab_strings }
better-bibtex_preferences_auto-abbrev = 
    .label = Abbrevia automaticamente il titolo delle riviste se non è impostato uno esplicitamente
better-bibtex_preferences_auto-abbrev_style = Stile dell'abbreviazione:
better-bibtex_preferences_auto-export = Esportazione automatica
better-bibtex_preferences_auto-export_delay = Ritarda l'esportazione automatica di
better-bibtex_preferences_auto-export_explanation = Qui si può solo controllare e rimuovere le esportazioni. Per impostare una nuova esportazione automatica, selezionare la voce 'mantieni aggiornato' proposta durante una normale esportazione.
better-bibtex_preferences_auto-export_fields_cached = 
    .label = In cache
better-bibtex_preferences_auto-export_fields_error = Errore
better-bibtex_preferences_auto-export_fields_journal-abbrev = 
    .label = Usa le abbreviazioni dei titoli delle riviste
better-bibtex_preferences_auto-export_fields_notes = 
    .label = Esporta note
better-bibtex_preferences_auto-export_fields_recursive = 
    .label = Esporta tutte le collezioni figlie
better-bibtex_preferences_auto-export_git_message = { $type } aggiornato da Better BibTeX for Zotero
better-bibtex_preferences_auto-export_idle = Quando inattivo
    .label = { better-bibtex_preferences_auto-export_idle }
better-bibtex_preferences_auto-export_immediate = A ogni modifica
    .label = { better-bibtex_preferences_auto-export_immediate }
better-bibtex_preferences_auto-export_off = Sospeso
    .label = { better-bibtex_preferences_auto-export_off }
better-bibtex_preferences_auto-export_remove = 
    .label = Rimuovi
better-bibtex_preferences_auto-export_run = 
    .label = Esporta ora
better-bibtex_preferences_auto-export_status = Status
better-bibtex_preferences_auto-export_status_done = fatto
better-bibtex_preferences_auto-export_status_error = errore
better-bibtex_preferences_auto-export_status_preparing = in preparazione
better-bibtex_preferences_auto-export_status_running = in esecuzione
better-bibtex_preferences_auto-export_status_scheduled = programmato
better-bibtex_preferences_auto-export_target = File di output
better-bibtex_preferences_auto-export_translator = Formato
better-bibtex_preferences_auto-export_type_collection = Collezione
better-bibtex_preferences_auto-export_type_library = Biblioteca
better-bibtex_preferences_auto-export_updated = Aggiornato
better-bibtex_preferences_bulk-warning = Avvisami quando si cambiano in massa le chiavi di citazione
better-bibtex_preferences_citekey_auto-pin-delay = Fissa automaticamente la chiave di citazione dopo
better-bibtex_preferences_citekey_aux-scanner_import = 
    .label = Durante la lettura di un file AUX, tentare l'importazione delle voci dal file bib allegato se le chiavi di citazione non sono presenti in Zotero
better-bibtex_preferences_citekey_fold = 
    .label = Forza la citazione in testo piano
better-bibtex_preferences_citekey_format = Formula per la chiave di citazione
better-bibtex_preferences_citekey_format_installed = Formula in uso per la chiave di citazione
better-bibtex_preferences_citekey_search = 
    .label = Attiva la ricerca di chiavi di citazione
better-bibtex_preferences_citekey_uniqueness = 
    .label = Mantieni unicità delle chiavi di citazione
better-bibtex_preferences_citekey_uniqueness_case = 
    .label = Ignore upper/lowercase when comparing for uniqueness
better-bibtex_preferences_citekey_uniqueness_conflict = Se c'è un conflitto con una chiave fissata, l'altra sarà
better-bibtex_preferences_citekey_uniqueness_conflict_change = suffissa (causa il cambio della chiave)
    .label = { better-bibtex_preferences_citekey_uniqueness_conflict_change }
better-bibtex_preferences_citekey_uniqueness_conflict_keep = mantenuta (causa chiavi duplicate)
    .label = { better-bibtex_preferences_citekey_uniqueness_conflict_keep }
better-bibtex_preferences_citekey_uniqueness_scope = Mantieni le chiavi uniche
better-bibtex_preferences_citekey_uniqueness_scope_global = in tutte le librerie
    .label = { better-bibtex_preferences_citekey_uniqueness_scope_global }
better-bibtex_preferences_citekey_uniqueness_scope_library = dentro a ogni singola libreria
    .label = { better-bibtex_preferences_citekey_uniqueness_scope_library }
better-bibtex_preferences_export_automatic-tags = 
    .label = Includi i tag automatici nell'esportazione
better-bibtex_preferences_export_biblatex_ascii = 
    .label = Esporta unicode come comandi latex in testo piano
better-bibtex_preferences_export_biblatex_biblatex-extract-eprint = 
    .label = Estrai informazioni di JSTOR/Google Books/PubMed dal campo URL nel campo eprint
better-bibtex_preferences_export_biblatex_extended-name-format = 
    .label = Usa il formato esteso dei nomi BibLaTeX (richiede biblatex 3.5)
better-bibtex_preferences_export_bibtex_ascii = 
    .label = Esporta unicode come comandi latex in testo piano (raccomandato)
better-bibtex_preferences_export_bibtex_urls = Inserisci gli URL all'esportazione BibTeX
better-bibtex_preferences_export_bibtex_urls_note = nel campo 'note'
    .label = { better-bibtex_preferences_export_bibtex_urls_note }
better-bibtex_preferences_export_bibtex_urls_note-url-ish = nel campo 'note', assumendo che il pacchetto 'url' non sia caricato
    .label = { better-bibtex_preferences_export_bibtex_urls_note-url-ish }
better-bibtex_preferences_export_bibtex_urls_off = no
    .label = { better-bibtex_preferences_export_bibtex_urls_off }
better-bibtex_preferences_export_bibtex_urls_url = nel campo 'url'
    .label = { better-bibtex_preferences_export_bibtex_urls_url }
better-bibtex_preferences_export_bibtex_urls_url-ish = nel campo 'url', assumendo che il pacchetto 'url' non sia caricato
    .label = { better-bibtex_preferences_export_bibtex_urls_url-ish }
better-bibtex_preferences_export_sort = Sort TeX/CSL output (useful if you use version control on the output):
better-bibtex_preferences_export_sort_off = off (fastest)
    .label = { better-bibtex_preferences_export_sort_off }
better-bibtex_preferences_export_sort_id = item creation order (plenty fast)
    .label = { better-bibtex_preferences_export_sort_id }
better-bibtex_preferences_export_sort_citekey = citation key (slow on very large libraries)
    .label = { better-bibtex_preferences_export_sort_citekey }
better-bibtex_preferences_export_fields = Fields
    .label = { better-bibtex_preferences_export_fields }
better-bibtex_preferences_export_fields_bibtex-edition-ordinal = 
    .label = Esporta il numero di edizione come ordinali in inglese
better-bibtex_preferences_export_fields_bibtex-particle-no-op = 
    .label = Ignora i prefissi dei nomi nell'ordinamento
better-bibtex_preferences_export_fields_doi-and-url = Quando un elemento ha sia un DOI che un URL, esporta
better-bibtex_preferences_export_fields_doi-and-url_both = entrambi
    .label = { better-bibtex_preferences_export_fields_doi-and-url_both }
better-bibtex_preferences_export_fields_doi-and-url_doi = DOI
    .label = { better-bibtex_preferences_export_fields_doi-and-url_doi }
better-bibtex_preferences_export_fields_doi-and-url_url = URL
    .label = { better-bibtex_preferences_export_fields_doi-and-url_url }
better-bibtex_preferences_export_fields_doi-and-url_warning = La maggior parte degli stili BibTeX non supporta i campi DOI/URL. Tra gli stili che li supportano, in molti dimenticano di richiamare il pacchetto 'url' necessario, per cui ricordati di farlo manualmente. I campi DOI e url sono campi cosiddetti 'verbatim', e senza il pacchetto 'url' probabilmente la compilazione non riuscirà.
better-bibtex_preferences_export_fields_export-strings = Se un campo può essere un riferimento a una variabile @string, esportalo senza parentesi
better-bibtex_preferences_export_fields_export-strings_detect = Assumi che i campi di una singola parola siano variabili @string
    .label = { better-bibtex_preferences_export_fields_export-strings_detect }
better-bibtex_preferences_export_fields_export-strings_match = Confrontalo con la dichiarazione @string sotto
    .label = { better-bibtex_preferences_export_fields_export-strings_match }
better-bibtex_preferences_export_fields_export-strings_match_reverse = Confrontalo con la dichiarazione @string e i loro valori sotto
    .label = { better-bibtex_preferences_export_fields_export-strings_match_reverse }
better-bibtex_preferences_export_fields_export-strings_off = No
    .label = { better-bibtex_preferences_export_fields_export-strings_off }
better-bibtex_preferences_export_fields_import-strings = 
    .label = Espandi le variabili @string sotto durante le importazioni
better-bibtex_preferences_export_fields_language = Esporta la lingua come
better-bibtex_preferences_export_fields_language_both = entrambi
    .label = { better-bibtex_preferences_export_fields_language_both }
better-bibtex_preferences_export_fields_skip = Campi da omettere dall'esportazione (separati da virgola)
better-bibtex_preferences_export_jabref-format = Includi metadati specifici di JabRef:
better-bibtex_preferences_export_jabref-format_0 = no
    .label = { better-bibtex_preferences_export_jabref-format_0 }
better-bibtex_preferences_export_jabref-format_3 = per JabRef 3
    .label = { better-bibtex_preferences_export_jabref-format_3 }
better-bibtex_preferences_export_jabref-format_4 = per JabRef 4
    .label = { better-bibtex_preferences_export_jabref-format_4 }
better-bibtex_preferences_export_jabref-format_5 = per JabRef 5
    .label = { better-bibtex_preferences_export_jabref-format_5 }
better-bibtex_preferences_export_jabref-format_warn = Esporta i campi specifici di JabRef: timestamp, titolo per gli allegati e gruppi per ogni collezione di cui un oggetto è parte. Si faccia attenzione che l'uso di questa opzione disattiva il caching nelle esportazioni, il che può rovinare l'esperienza d'uso, in particolare con le esportazioni automatiche.
better-bibtex_preferences_export_quality-report = 
    .label = Includi commenti su potenziali problemi relativi alle voci esportate
better-bibtex_preferences_export_quick-copy = Copia veloce
    .label = { better-bibtex_preferences_export_quick-copy }
better-bibtex_preferences_export_quick-copy_explanation = Copia veloce/trascinamento citazioni
better-bibtex_preferences_export_quick-copy_format = Formato Copia veloce
better-bibtex_preferences_export_quick-copy_citekeys = Chiavi di citazione
    .label = { better-bibtex_preferences_export_quick-copy_citekeys }
better-bibtex_preferences_export_quick-copy_eta-template = Template Eta
    .label = { better-bibtex_preferences_export_quick-copy_eta-template }
better-bibtex_preferences_export_quick-copy_latex = Citazione LaTeX
    .label = { better-bibtex_preferences_export_quick-copy_latex }
better-bibtex_preferences_export_quick-copy_latex_command = Comando LaTeX
    .label = { better-bibtex_preferences_export_quick-copy_latex_command }
better-bibtex_preferences_export_quick-copy_org-mode = Org-mode, seleziona link
    .label = { better-bibtex_preferences_export_quick-copy_org-mode }
better-bibtex_preferences_export_quick-copy_org-mode_citekey = usa chiave di citazione di Better BibTeX
    .label = { better-bibtex_preferences_export_quick-copy_org-mode_citekey }
better-bibtex_preferences_export_quick-copy_org-mode_zotero = using la chiave dell'elemento di Zotero
    .label = { better-bibtex_preferences_export_quick-copy_org-mode_zotero }
better-bibtex_preferences_export_quick-copy_org-ref = Citazione org-ref
    .label = { better-bibtex_preferences_export_quick-copy_org-ref }
better-bibtex_preferences_export_quick-copy_org-ref3 = Citazione org-ref v3
    .label = { better-bibtex_preferences_export_quick-copy_org-ref3 }
better-bibtex_preferences_export_quick-copy_pandoc = Citazione Pandoc
    .label = { better-bibtex_preferences_export_quick-copy_pandoc }
better-bibtex_preferences_export_quick-copy_pandoc_brackets = 
    .label = Racchiudi le citazioni Pandoc tra parentesi quadre
better-bibtex_preferences_export_quick-copy_roam-cite-key = Roam Cite Key
    .label = { better-bibtex_preferences_export_quick-copy_roam-cite-key }
better-bibtex_preferences_export_quick-copy_rtf-scan = RTF Scan marker
    .label = { better-bibtex_preferences_export_quick-copy_rtf-scan }
better-bibtex_preferences_export_quick-copy_select-link = Zotero select link
    .label = { better-bibtex_preferences_export_quick-copy_select-link }
better-bibtex_preferences_export_quick-copy_select-link_citekey = usa chiave di citazione di Better BibTeX
    .label = { better-bibtex_preferences_export_quick-copy_select-link_citekey }
better-bibtex_preferences_export_quick-copy_select-link_zotero = using la chiave dell'elemento di Zotero
    .label = { better-bibtex_preferences_export_quick-copy_select-link_zotero }
better-bibtex_preferences_open = 
    .label = Apri preferenze di BetterBibTeX...
better-bibtex_preferences_postscript_warn = 
    .value = L'uso di 'Translator.options.exportPath' in postscript disattiva la cache. Le esportazioni saranno significativamente più lente.
better-bibtex_preferences_prefpane_loading = Caricamento di Better BibTeX in corso
better-bibtex_preferences_rescan-citekeys = 
    .label = Ri-esamina le chiavi fissate
better-bibtex_preferences_reset-cache = 
    .label = Reset della cache
better-bibtex_preferences_tab_auto-export = Esportazione automatica
    .label = { better-bibtex_preferences_tab_auto-export }
better-bibtex_preferences_tab_citekey = Chiavi di citazione
    .label = { better-bibtex_preferences_tab_citekey }
better-bibtex_preferences_tab_export = Esporta
    .label = { better-bibtex_preferences_tab_export }
better-bibtex_preferences_tab_import = Importa
    .label = { better-bibtex_preferences_tab_import }
better-bibtex_preferences_tab_misc = Varie
    .label = { better-bibtex_preferences_tab_misc }
better-bibtex_report-errors = Invia log di debug di Better BibTeX...
better-bibtex_server-url = 
    .title = Esportazionie di Better BibTeX via HTTP
    .buttonlabelaccept = OK
better-bibtex_server-url_description = URL di download:
better-bibtex_server-url_format = Scarica elementi come
better-bibtex_server-url_or = o
better-bibtex_startup_auto-export = Avvio dell'esportazione automatica
better-bibtex_startup_auto-export_load = Inizializzazione dell'esportazione automatica
better-bibtex_startup_installing-translators = Installazione dei traduttori inclusi
better-bibtex_startup_journal-abbrev = Caricamento abbreviatore dei titoli delle riviste
better-bibtex_startup_key-manager = Avvio del manager delle chiavi
better-bibtex_startup_serialization-cache = Avvio della cache di serializzazione
better-bibtex_startup_waiting-for-zotero = In attesa del database di Zotero
better-bibtex_translate_error_target_no_parent = { $path } non hauna cartella genitore
better-bibtex_translate_error_target_not_a_file = { $path } esiste ma non è un file
better-bibtex_units_seconds = secondi
better-bibtex_workers_status = Numero di esportazioni avviate in background: { $total }, in esecuzioine: { $running }
better-bibtex_zotero-pane_add-citation-links = Grafico di citazione: aggiungi link...
better-bibtex_zotero-pane_citekey_pin_inspire-hep = Fissa chiavi BibTeX da InspireHEP
better-bibtex_zotero-pane_citekey_refresh = Aggiorna chiavi BibTeX
better-bibtex_zotero-pane_citekey_unpin = Sblocca chiavi BibTeX
better-bibtex_zotero-pane_column_citekey = { -citation-key }
better-bibtex_zotero-pane_patch-dates = Copia date-added/date-modified dal campo extra
better-bibtex_zotero-pane_sentence-case = BBT Tutte le Iniziali Maiuscole
better-bibtex_zotero-pane_show_collection-key = Scarica esportazione di Better BibTeX...
better-bibtex_zotero-pane_tag_duplicates = Tagga chiavi di citazione duplicate
better-bibtex_zotero-pane_tex-studio = Invia voci a TeXstudio
betterbibtex-item-pane-header = { -citation-key }
