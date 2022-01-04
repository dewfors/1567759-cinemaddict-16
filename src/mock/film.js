import {nanoid} from 'nanoid';
import {generateComment} from './comment.js';
import {getRandomInteger, getRandomiseArray} from '../utils/utils.js';

const mockData = {
  titles: [
    'Лига справедливости',
    'Охотники на монстров',
    'Ведьмы',
    'Аннигиляция',
    'Последний богатырь',
    'Петля времени',
    'Аватар',
    'Чудо-женщина',
    'Пиксели',
  ],
  fullTitles: [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'Made for Each Other',
  ],
  posters: [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ],
  directors: [
    'Amy Lynne Seimetz',
    'Peter Sullivan',
    'Richard Allan Salomon',
    'Christopher Michael Sanders',
    'Adam Richard Sandler',
    'Jennifer Siebel',
    'Steven Seagal',
  ],
  writers: [
    'Quentin Tarantino',
    'Hayao Miyazaki',
    'Takeshi Kitano',
    'Wes Anderson',
    'Martin Scorsese',
    'Steven Spielberg',
    'Stanley Kubrick',
  ],
  actors: [
    'Al Pacino',
    'Audrey Hepburn',
    'Bill Murray',
    'Brittany Murphy',
    'Bruce Willis',
    'Cuba Gooding Jr.',
    'Danny DeVito',
  ],
  genre: [
    'Musical',
    'Western',
    'Drama',
    'Comedy',
    'Cartoon',
    'Mystery',
  ],
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  countries: [
    'Belgium',
    'Gambia',
    'Colombia',
    'Mexico',
    'Russia',
    'Turkey',
    'USA',
    'Brazil',
    'United Kingdom',
  ],
};

const generateTitle = () => mockData.titles[getRandomInteger(0, mockData.titles.length - 1)];

const generateFullTitle = () => mockData.fullTitles[getRandomInteger(0, mockData.fullTitles.length - 1)];

const generatePoster = () => mockData.posters[getRandomInteger(0, mockData.posters.length - 1)];

const generateDirector = () => mockData.directors[getRandomInteger(0, mockData.directors.length - 1)];

const generateWriters = () => {
  const countWriters = getRandomInteger(1, 2);
  return getRandomiseArray(mockData.writers, countWriters);
};

const generateActors = () => getRandomiseArray(mockData.actors, mockData.actors.length - 1);

const generateGenre = () => {
  const countGenre = getRandomInteger(1, 3);
  return getRandomiseArray(mockData.genre, countGenre);
};

const generateDescription = () => {
  const descriptionSentenceMin = 1;
  const descriptionSentenceMax = 5;
  const descriptionArray = mockData.description.split('.')
    .map((text) => text.trim())
    .filter((text) => text.length > 0);

  const randomCountDescriptionSentence = getRandomInteger(descriptionSentenceMin, descriptionSentenceMax);
  const randomDescriptionArray = getRandomiseArray(descriptionArray, randomCountDescriptionSentence);
  return `${randomDescriptionArray.join('. ').trim()}.`;
};

const generateDate = () => {
  const daysGap = getRandomInteger(31, 365);
  return (
    Date.now() - Math.floor(Math.random() * daysGap) * 24 * 60 * 60 * 1000
  );
};

const generateCountry = () => mockData.countries[getRandomInteger(0, mockData.countries.length - 1)];

const generateRelease = () => ({
  date: generateDate(),
  releaseCountry: generateCountry(),
});

const generateComments = () => {
  const randomCountComments = getRandomInteger(0, 5);
  return new Array(randomCountComments).fill().map(generateComment);
};


export const generateFilm = () => ({
  id: nanoid(),
  title: generateTitle(),
  alternativeTitle: generateFullTitle(),
  totalRating: 5.3,
  poster: `images/posters/${generatePoster()}`,
  ageRating: 3,
  director: generateDirector(),
  writers: generateWriters(),
  actors: generateActors(),
  release: generateRelease(),
  runtime: getRandomInteger(45, 230),
  genre: generateGenre(),
  description: generateDescription(),
  comments: generateComments(),
  userDetails: {
    watchlist: Math.random() >= 0.5,
    alreadyWatched: Math.random() >= 0.5,
    watchingDate: generateDate(),
    favorite: Math.random() >= 0.5,
  }
});
