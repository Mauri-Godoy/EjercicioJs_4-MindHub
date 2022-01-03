/* Variables*/
const statstistics = statstistics_json;
const democratas = statstistics.members.democratas;
const republicans = statstistics.members.republicans;
const independents = statstistics.members.independents;

let arrayVotesWithParty;
let arrayMissedVotes;

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

        fillJson();

        const tenPercent = (missedVotes.length * 0.1);

        let main = new Vue({
            el: '#main',
            data: {
                statstistics: statstistics,
                democratas: democratas,
                republicans: republicans,
                independents: independents,
                tenPercent: tenPercent
            }
        })

    });


// Agregar todo al json

function fillJson() {
    addJsonMembers(democratas, 'D');
    addJsonMembers(republicans, 'R');
    addJsonMembers(independents, 'ID');

    addJson(getPercectVotes, democratas, statstistics.attendance.votedPartyPercentage);
    addJson(getPercectVotes, republicans, statstistics.attendance.votedPartyPercentage);
    addJson(getPercectVotes, independents, statstistics.attendance.votedPartyPercentage);

    addJson(getPercectVotesLoyalty, democratas, statstistics.partyLoyalty.votedPartyPercentage);
    addJson(getPercectVotesLoyalty, republicans, statstistics.partyLoyalty.votedPartyPercentage);
    addJson(getPercectVotesLoyalty, independents, statstistics.partyLoyalty.votedPartyPercentage);

    addJsonTotal(getTotalPercectVotes(), statstistics.totalAttendance.votedPartyPercentage);
    addJsonTotal(getTotalPercectVotesLoyalty(), statstistics.totalPartyLoyalty.votedPartyPercentage);


    missedVotes = getSortMissedVotes();
    addJsonTotalSort(missedVotes, statstistics.totalAttendance.missedVotes);

    votesWithParty = getSortVotesWithParty();
    addJsonTotalSort(votesWithParty, statstistics.totalPartyLoyalty.votesWithParty);

    console.table(statstistics);
}


/* Agregar miembros por cada partido al JSON*/

function addJsonMembers(party, char) {
    members.forEach(member => {
        if (member.party == char) {
            party.push(member);
        }
    });
}

/* Agregar datos al json*/

function addJson(fun, party, location) {
    location.push(fun(party));
}

function addJsonTotal(fun, location) {
    location.push(fun);
}

function addJsonTotalSort(sort, location) {
    sort.forEach(m => {
        addJsonTotal(m, location);
    });
}


/*Obtener el porcentaje de missed_votes_pct por cada partido*/

function getPercectVotes(party) {
    let percectVotes = 0;
    for (let index = 0; index < party.length; index++) {
        if (party[index].missed_votes_pct) {
            percectVotes += party[index].missed_votes_pct;
        }
    }
    if (party.length) {
        return Math.round(percectVotes / party.length);
    } else {
        return 0;
    }
}

function getTotalPercectVotes() {
    if (getPercectVotes(independents)) {
        return Math.round((getPercectVotes(democratas) + getPercectVotes(republicans) + getPercectVotes(independents)) / 3);
    } else {
        return Math.round((getPercectVotes(democratas) + getPercectVotes(republicans)) / 2);
    }
}

/*Obtener el porcentaje de votos por cada partido*/

function getPercectVotesLoyalty(party) {
    let percectVotes = 0;
    for (let index = 0; index < party.length; index++) {
        if (party[index].votes_with_party_pct) {
            percectVotes += party[index].votes_with_party_pct;
        }
    }
    if (party.length) {
        return Math.round(percectVotes / party.length);
    } else {
        return 0;
    }
}

function getTotalPercectVotesLoyalty() {
    if (getPercectVotesLoyalty(independents)) {
        return Math.round((getPercectVotesLoyalty(democratas) + getPercectVotesLoyalty(republicans) + getPercectVotesLoyalty(independents)) / 3);
    } else {
        return Math.round((getPercectVotesLoyalty(democratas) + getPercectVotesLoyalty(republicans)) / 2);
    }
}


/*Ordenar array segun missed_votes*/

function getSortMissedVotes() {

    arrayMissedVotes = members.sort(function (a, b) {
        if (a.missed_votes_pct < b.missed_votes_pct) {
            return 1;
        }
        if (a.missed_votes_pct > b.missed_votes_pct) {
            return -1;
        }
        return 0;
    });

    return arrayMissedVotes;
}

/*Ordenar array segun votes_with_party_pct*/

function getSortVotesWithParty() {

    arrayVotesWithParty = members.sort(function (a, b) {
        if (a.votes_with_party_pct < b.votes_with_party_pct) {
            return 1;
        }
        if (a.votes_with_party_pct > b.votes_with_party_pct) {
            return -1;
        }
        return 0;
    });

    return arrayVotesWithParty;
}

