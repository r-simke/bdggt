new Vue({
    el: '#app',
    data: {
        nuvarandeSaldo: '',
        ingaFlereUtgifter: false,
        pengarPerDag: 0,
        dagarTillLon: 0,
        nastaLonedag: '',
        resultat: '',
        sparadBudgetResultat: '',
        valdDagligBudget: 0,
        visaSlider: false,
        idag: new Date().setHours(0, 0, 0, 0),
    },
    methods: {
        humanReadableDate: function (date) {
            return date && date.toLocaleDateString('sv-SE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        humanReadable: function (number) {
            return number && parseInt(number, 10).toLocaleString('sv-SE');
        },
        hittaNastaLonedag: function () {

            for (let datum of lonedagar) {
                const lonedag = new Date(datum);
                if (lonedag > this.idag) {
                    this.nastaLonedag = lonedag;
                    return;
                }
            }
            this.nastaLonedag = "Okänt datum. Lägg till fler lönedagar i JavaScript-koden!";
        },
        beraknaDagarTillLon: function () {
            const nastaLonedag = new Date(this.nastaLonedag);

            if (this.ingaFlereUtgifter && nastaLonedag) {
                return -1 + Math.round((nastaLonedag - this.idag) / (1000 * 60 * 60 * 24));
            } else {
                return Math.round((nastaLonedag - this.idag) / (1000 * 60 * 60 * 24));
            }
        },
        beraknaBudget: function () {
            if(this.nuvarandeSaldo === '' || !isNaN(this.nuvarandeSaldo)) {
                localStorage.setItem('nuvarandeSaldo', this.nuvarandeSaldo);
            } else {
                localStorage.removeItem('nuvarandeSaldo');
            }
            if (this.nuvarandeSaldo && !isNaN(this.nuvarandeSaldo) && this.nuvarandeSaldo > 0) {
                this.visaSlider = true;
                this.dagarTillLon = this.beraknaDagarTillLon();

                this.pengarPerDag = Math.round(this.nuvarandeSaldo / Math.max(this.dagarTillLon, 1));
                this.valdDagligBudget = this.pengarPerDag;

                this.sparadBudgetResultat = '';

                this.resultat = "Du har " + this.dagarTillLon + " dag(ar) kvar till lön och kan spendera<br /><strong>" + this.pengarPerDag.toLocaleString('sv-SE') + " kr</strong> per dag.";
            } else {
                this.visaSlider = false;
                this.resultat = "Vänligen ange ett giltigt saldo.";
            }
        },
        visaSparMotivation: function () {
            const slumpIndex = Math.floor(Math.random() * motivationer.length);
            const slumpMotivation = motivationer[slumpIndex];

            this.sparadBudgetResultat += "<p><em>" + slumpMotivation + "</em></p>";
        },
        visaAnpassadBudget: function () {
            const anpassadBudget = parseInt(this.valdDagligBudget, 10);
            const sparadePengar = Math.round(this.nuvarandeSaldo - (anpassadBudget * this.dagarTillLon));
            if (sparadePengar > 0) {
                this.sparadBudgetResultat = "Om du klarar dig med " + anpassadBudget.toLocaleString('sv-SE') + " kr per dag, kommer du ha <br/><strong>" + sparadePengar.toLocaleString('sv-SE') + " kr</strong> kvar på lönedagen.";
                this.visaSparMotivation();
            } else {
                this.sparadBudgetResultat = '';
            }
        }
    },
    mounted: function () {
        this.hittaNastaLonedag();
        // read the nuvarandeSaldo from local storage
        this.nuvarandeSaldo = localStorage.getItem('nuvarandeSaldo') || '';
        if (this.nuvarandeSaldo) {
            this.beraknaBudget();
        }
    }
});
