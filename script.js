/*la prima stringa di codice aspetta che il dom sia completamente stato caricato
    evitando quindi problemi di elaborazione*/
document.addEventListener('DOMContentLoaded', function() {
    /*dichiarazione delle costanti (div caselle contenitori) e (btn button)*/
    const form = document.getElementById('equazioneForm');
    const risultatoDiv = document.getElementById('risultato');
    const storiaBtn = document.getElementById('storiaBtn');
    const storiaDiv = document.getElementById('storia');
    const storiaLista = document.getElementById('storiaLista');
    const resetBtn = document.getElementById('resetBtn');

    let richieste = JSON.parse(localStorage.getItem('richieste')) || [];
    /*utilizzo local storage perchè non avevo voglia di avere un vero json 
        più macchinoso, configura l'interfaccia, conta le chiavi... non avevo voglia... localstorage in browser*/

    /*calcolo vero e proprio... potevo letteralmente mettere solo questa cosa praticamente nello script
        ma le cose fanno fatte belle e incomprensibili
        preciso che .tofixed() è un metodo conversore (si identifica per il TO) e tiene solo i primi 2 decimali
        si usa ` per concatenare stringhe per esempio nei return e si usa il {} per "inserire una variabile" nel testo
        non sono un professore, però a mente è comodo, l'ho scoperto a relatech
    */
    function calcolaSoluzioni(a, b, c) {
        const delta = b * b - 4 * a * c;
        if (delta < 0) {
            return 'Nessuna soluzione reale';
        } else if (delta === 0) {
            const x = (-b / (2 * a)).toFixed(2);
            return `x = ${x}`;
        } else {
            const x1 = ((-b + Math.sqrt(delta)) / (2 * a)).toFixed(2);
            const x2 = ((-b - Math.sqrt(delta)) / (2 * a)).toFixed(2);
            return `x1 = ${x1}, x2 = ${x2}`;
        }
    }

    // Funzione per ottenere informazioni del sistema per stampare meglio la storia
    // è un metodo, viene creato per riempire le nuove caselle quando viene salvato un dato
    function getInfoSistema() {
        //qua creo una const "ora" che avrà le proprietà di Date()
        const ora = new Date();
        const giorno = ora.toLocaleDateString();
        const orario = ora.toLocaleTimeString();
        const id = richieste.length + 1;
        return { id, giorno, orario,};
    }

    // Funzione per salvare richiesta in locale e visualizzare le ultime 10
    function salvaRichiesta(a, b, c, risultato) {
        const infoSistema = getInfoSistema();
        const nuovaRichiesta = {
            id: infoSistema.id,
            equazione: `(${a})x² + (${b})x + (${c}) = 0`,
            risultato,
            giorno: infoSistema.giorno,
            orario: infoSistema.orario,
        };

        // Aggiungi la nuova richiesta
        richieste.push(nuovaRichiesta);

        // Mantieni solo le ultime 10 in caso le butta via
        if (richieste.length > 10) {
            richieste.shift();
        }

        //setto il local storage aggiornandolo
        localStorage.setItem('richieste', JSON.stringify(richieste));
    }

    // Funzione per visualizzare le ultime 10 richieste
    function mostraStoria() {
        storiaLista.innerHTML = '';
        richieste.forEach((richiesta) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>Richiesta ${richiesta.id}</strong><br>
                            Equazione: ${richiesta.equazione}<br>
                            Risultato: ${richiesta.risultato}<br>
                            Data: ${richiesta.giorno} alle ${richiesta.orario}`;
            storiaLista.appendChild(li);
        });
    }

    //il js rimane in listening, aspettando un'azione dell'utente su un box con metodo, questi sono tutte le reazioni del sito all'utente
    // Evento di submit per il form
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Ottieni i valori inseriti
        const a = parseFloat(document.getElementById('a').value);
        const b = parseFloat(document.getElementById('b').value);
        const c = parseFloat(document.getElementById('c').value);

        // Controlla che a sia diverso da 0 (non è un'equazione di secondo grado se a=0)
        if (isNaN(a) || a === 0 || isNaN(b) || isNaN(c)) {
            risultatoDiv.textContent = 'Inserisci valori corretti per a, b e c (a ≠ 0)';
            risultatoDiv.style.color = 'red';
        } else {
            const risultato = calcolaSoluzioni(a, b, c);
            risultatoDiv.textContent = risultato;
            risultatoDiv.style.color = 'black';

            // Salva la richiesta solo se è corretta
            salvaRichiesta(a, b, c, risultato);
        }
    });

    // Evento di reset del form
    resetBtn.addEventListener('click', function() {
        form.reset();
        risultatoDiv.textContent = '';
    });

    // Mostra o nasconde la storia con aggiornamento del testo del pulsante
    storiaBtn.addEventListener('click', function() {
        if (storiaDiv.style.display === 'none') {
            mostraStoria();
            storiaDiv.style.display = 'block';
            storiaBtn.textContent = 'Nascondi Storia';
            window.scrollTo(0, 0); // Prevenzione scroll automatico
        } else {
            storiaDiv.style.display = 'none';
            storiaBtn.textContent = 'Mostra Storia';
        }
    });
});