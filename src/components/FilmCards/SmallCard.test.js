import { screen, render } from "@testing-library/react";
import SmallCard from "./SmallCard";

const testFilms = [{
    "backdropPath": "/7d6EY00g1c39SGZOoCJ5Py9nNth.jpg",
    "genre": [
        "Animation"
    ],
    "id": 1,
    "slug": "spider-man-into-the-spider-verse",
    "language": [
        "en"
    ],
    "overview": "Miles Morales is juggling his life between being a high school student and being a spider-man. When Wilson \"Kingpin\" Fisk uses a super collider, others from across the Spider-Verse are transported to this dimension.",
    "logLine": "A short one-sentence explanation of the film.",
    "posterPath": "/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    "releaseDate": "2018-12-06",
    "title": "Spider-Man: Into the Spider-Verse",
    "video": false,
    "vimeoId": "12345678",
    "course": [
        "Television in the US"
    ],
    "directors": [
        "Wayne Wang"
    ],
    "actors": [
        "Nicholas Sliter",
        "Jiaqi Li",
        "Wayne Wang",
        "Becca Hochman-Fisher",
        "Nicholas McKalip",
        "Katie Kosior"
    ],
    "contributors": [],
    "duration": "142 min",
    "term": "F21"
},
{
    "backdropPath": "/sQkRiQo3nLrQYMXZodDjNUJKHZV.jpg",
    "genre": [
        "Drama",
        "Sci-fi"
    ],
    "id": 2,
    "slug": "justice-league-dark-apokolips-war",
    "language": [
        "en"
    ],
    "overview": "Earth is decimated after intergalactic tyrant Darkseid has devastated the Justice League in a poorly executed war by the DC Super Heroes. Now the remaining bastions of good – the Justice League, Teen Titans, Suicide Squad and assorted others – must regroup, strategize and take the war to Darkseid in order to save the planet and its surviving inhabitants.",
    "logLine": "A short one-sentence explanation of the film.",
    "posterPath": "/c01Y4suApJ1Wic2xLmaq1QYcfoZ.jpg",
    "releaseDate": "2020-05-05",
    "title": "Justice League Dark: Apokolips War",
    "video": false,
    "vimeoId": "12345678",
    "course": [
        "Film Theory"
    ],
    "directors": [
        "Wayne Wang"
    ],
    "actors": [
        "Nicholas Sliter",
        "Jiaqi Li",
        "Wayne Wang",
        "Becca Hochman-Fisher",
        "Nicholas McKalip",
        "Katie Kosior"
    ],
    "contributors": [],
    "duration": "142 min",
    "term": "F20"
}];

describe.skip("SmallCard: SmallCard initialization", ()=>{
    test("SmallCard: Handles film without error", () => {
        render(<SmallCard film={testFilms[1]} />);
    });
})

describe.skip("SmallCard: SmallCard contents", ()=>{
    test("Film title shows up", async () =>{

        const { getByText } = render(<SmallCard film={testFilms[0]}/>);
        expect(getByText(testFilms[0].title)).toBeInTheDocument();
        expect(getByText(testFilms[0].title)).toBeVisible();

    });

    test("Film duration shows up", async () => {
        const { getByText } = render(<SmallCard film={testFilms[0]}/>);
        expect(getByText(testFilms[0].duration)).toBeInTheDocument();
        expect(getByText(testFilms[0].duration)).toBeVisible();
    });

    test("Film genre shows up", async () => {
        const { getByText } = render(<SmallCard film={testFilms[0]}/>);
        expect(getByText(testFilms[0].genre)).toBeInTheDocument();
        expect(getByText(testFilms[0].genre)).toBeVisible();
    });

    test("Film logLine shows up", async () => {
        const { getByText } = render(<SmallCard film={testFilms[0]}/>);
        expect(getByText(testFilms[0].logLine)).toBeInTheDocument();
        expect(getByText(testFilms[0].logLine)).toBeVisible();
    });

    test("Test small poster displays", async () => {
        render(<SmallCard film={testFilms[0]}/>);
        const showSmallPoster = await screen.findAllByTestId("smallPosterTest");
        expect(showSmallPoster[0]).toBeVisible();
    });
    
})