/* fetch*/
var cabeceraAJAX = new Headers({
    "X-API-Key": "9VEjL1KFml63Msrgr0w0jKHG2YTegbsnTiK6Sx2z",
});

var miInit = { headers: cabeceraAJAX };

propublica = 'house'

if (document.title.includes('Senate')) {
    propublica = 'senate'
}

fetch(`https://api.propublica.org/congress/v1/113/${propublica}/members.json`, miInit)
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {

        members = myJson.results[0].members;

        let optionsState = createOptions();


        /* vue */

        let form = new Vue({
            el: '#form',
            data: {
                optionsState: optionsState,
                select: "all",
                party: ['D', 'R', 'ID']
            }
        })


        let tableData = new Vue({
            el: '#tableData',
            data: {
                members: members,
            },
            computed: {
                filterMembers() {
                    return this.members.filter(member => {
                        if ((member.state == form.select || form.select == "all") && form.party.includes(member.party)) {
                            return member;
                        }
                    })
                }
            }
        })


    })

//creador de array options para el select

function createOptions() {

    let options = [];

    members.forEach(m => {
        if (!options.includes(m.state)) {
            options.push(m.state);

        }
    });

    return options;
}