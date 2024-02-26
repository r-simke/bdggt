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
        showThemeSelector: false, // Styr visningen av tema-väljaren
        currentTheme: '', // Håller reda på det aktuella temat
        themes: {
            theme1: 'linear-gradient(135deg, #FFC371 0%, #FF5F6D 100%)', // Soluppgång
            theme2: 'linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)', // Citruspress
            theme3: 'linear-gradient(60deg, #96DED1 0%, #50C9C3 100%)', // Kylig Mint
            theme4: 'linear-gradient(120deg, #FAD0C4 0%, #FFD1FF 100%)', // Godisdröm
            theme5: 'linear-gradient(90deg, #84fab0 0%, #8fd3f4 100%)', // Stranddag
            theme6: 'linear-gradient(75deg, #D4FC79 0%, #96E6A1 100%)', // Frisk Vårmorgon
            theme7: 'linear-gradient(30deg, #FCCB90 0%, #D57EEB 100%)', // Lavendel Te
            theme8: 'linear-gradient(105deg, #c2e59c 0%, #64b3f4 100%)', // Klar himmel
            theme9: 'linear-gradient(135deg, rgba(231, 241, 247, 1) 0%, rgba(179, 158, 219, 1) 100%)', //default
            theme10: 'linear-gradient(135deg, #F5F7FA 0%, #C3CFE2 100%)', // Molnig dag

            // Lägg till fler teman efter eget önskemål
        }

    },
    methods: {
        toggleThemeSelector: function () {
            this.showThemeSelector = !this.showThemeSelector; // Visa/dölj temaväljaren
        },
        changeTheme: function (themeName) {
            this.currentTheme = themeName; // Uppdatera det valda temat
            localStorage.setItem('selectedTheme', themeName); // Spara det valda temat i localStorage
            this.applyTheme(); // Tillämpa det valda temat
        },
        applyTheme: function () {
            const themeGradient = this.themes[this.currentTheme];
            if (themeGradient) {
                document.documentElement.style.background = themeGradient;
            }
        },
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
                const lonedag = new Date(datum).setHours(0, 0, 0, 0);
                if (lonedag > this.idag) {
                    this.nastaLonedag = new Date(datum);
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
            if (this.nuvarandeSaldo === '' || !isNaN(this.nuvarandeSaldo)) {
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
        },
        initDraggableLogo: function () {
            const logo = document.querySelector('.logo');
            let offsetX, offsetY, initialX, initialY;

            logo.addEventListener('mousedown', (e) => {
                offsetX = e.clientX - logo.getBoundingClientRect().left;
                offsetY = e.clientY - logo.getBoundingClientRect().top;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                logo.style.cursor = 'grabbing';
            });

            logo.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                offsetX = touch.clientX - logo.getBoundingClientRect().left;
                offsetY = touch.clientY - logo.getBoundingClientRect().top;
                document.addEventListener('touchmove', onTouchMove);
                document.addEventListener('touchend', onTouchEnd);
            });

            const onMouseMove = (e) => {
                moveAt(e.clientX, e.clientY);
            };

            const onTouchMove = (e) => {
                const touch = e.touches[0];
                moveAt(touch.clientX, touch.clientY);
            };

            const moveAt = (clientX, clientY) => {
                logo.style.left = `${clientX - offsetX}px`;
                logo.style.top = `${clientY - offsetY}px`;
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                logo.style.cursor = 'grab';
                resetPosition();
            };

            const onTouchEnd = () => {
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
                resetPosition();
            };

            const resetPosition = () => {
                setTimeout(() => {
                    logo.style.transition = 'all 5s ease';
                    logo.style.left = `0px`;
                    logo.style.top = `0px`;

                    // Ta bort övergången efter att den är klar för att återställa drag-funktionen
                    logo.addEventListener('transitionend', () => {
                        logo.style.transition = '';
                    }, { once: true });
                }, 5000); // 5 sekunders fördröjning
            };
        },
    },
    mounted: function () {
        // Läs det sparade temat från localStorage när appen laddas
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            this.applyTheme();
        }
        this.hittaNastaLonedag();
        // read the nuvarandeSaldo from local storage
        this.nuvarandeSaldo = localStorage.getItem('nuvarandeSaldo') || '';
        if (this.nuvarandeSaldo) {
            this.beraknaBudget();
        }
        this.initDraggableLogo();
    }
});
