class DateParser{
    static monthMap_de = {
        "Januar": "January",
        "Februar": "February",
        "März": "March",
        "April": "April",
        "Mai": "May",
        "Juni": "June",
        "Juli": "July",
        "August": "August",
        "September": "September",
        "Oktober": "October",
        "November": "November",
        "Dezember": "December"
    };

    static monthMap_nl = {
        'Januari': "January",
        'Februari': "February",
        'Maart': "March",
        'April': "April",
        'Mei': "May",
        'Juni': "June",
        'Juli': "July",
        'Augustus': "August",
        'September': "September",
        'Oktober': "October",
        'November': "November",
        'December': "December"
    };

    static monthMap_se = {
        "januari": "January",
        "februari": "February",
        "mars": "March",
        "april": "April",
        "maj": "May",
        "juni": "June",
        "juli": "July",
        "augusti": "August",
        "september": "September",
        "oktober": "October",
        "november": "November",
        "december": "December"
    };

    constructor() {
        //
    }

    static parseRegistrationEndDate(dateString,version) {
        //
        dateString = dateString.replace(/(\d+)(th|st|nd|rd|\.)/, '$1');
        // map zuweisen
        let [day, month, year] = dateString.split(" ");
        switch (version) {
            case "www.howrse.de":
                month = this.monthMap_de[month];
                break;
            case "nl.howrse.com":
                month = this.monthMap_nl[month];
                break;
            case "www.howrse.se":
                month = this.monthMap_se[month];
                break;
            default:
                break;
        }
        // außerhalb parsen falls nötig
        // date zurückgeben
        let formattedDateString = `${day} ${month} ${year}`; // month day year actually but it's ok like this
        return new Date(formattedDateString);
    }
}

/*
// Define a mapping of German month names to English
const monthMap_de = {
    "Januar": "January",
    "Februar": "February",
    "März": "March",
    "April": "April",
    "Mai": "May",
    "Juni": "June",
    "Juli": "July",
    "August": "August",
    "September": "September",
    "Oktober": "October",
    "November": "November",
    "Dezember": "December"
};

// The date string
const dateString = "11. März 2025";

// Split the date string and convert the month
const [day, monthGerman, year] = dateString.split(" ");
const monthEnglish = monthMap[monthGerman];

// Create the date string in a format that JavaScript can parse
const formattedDateString = `${monthEnglish} ${day}, ${year}`;

//
// english
new Date(Date.parse($("#center-tab-main").find(".tab-action.tab-action-select.button.button-style-14").parent().parent().find(".grid-cell.align-top")[0].textContent.replace(/(\d+)(th|st|nd|rd)/, '$1')));

//
// Parse the date string
const [day, monthName, year] = dateString.split(' ');
// Convert month name to number
const monthMap_nl = {
    'Januari': 1,
    'Februari': 2,
    'Maart': 3,
    'April': 4,
    'Mei': 5,
    'Juni': 6,
    'Juli': 7,
    'Augustus': 8,
    'September': 9,
    'Oktober': 10,
    'November': 11,
    'December': 12
};

const month = monthMap[monthName];

// Create a Temporal.PlainDate object
const temporalDate = Temporal.PlainDate.from(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);

console.log(temporalDate.toString()); // Output: 2025-03-11

//
// Create a mapping of Swedish month names to their English equivalents
const monthMap_se = {
    "januari": "January",
    "februari": "February",
    "mars": "March",
    "april": "April",
    "maj": "May",
    "juni": "June",
    "juli": "July",
    "augusti": "August",
    "september": "September",
    "oktober": "October",
    "november": "November",
    "december": "December"
};

// Extract the day, month, and year from the Swedish date string
const [day, monthSwedish, year] = swedishDateString.split(" ");

// Convert the month from Swedish to English
const monthEnglish = monthMap[monthSwedish.toLowerCase()];

// Create a formatted date string in ISO format (YYYY-MM-DD)
const isoDateString = `${year}-${String(Object.keys(monthMap).indexOf(monthSwedish.toLowerCase()) + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

// Use the Temporal API to create a Temporal.PlainDate instance
const date = Temporal.PlainDate.from(isoDateString);
// */