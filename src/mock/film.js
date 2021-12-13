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
  generateTitle() {
    return this.titles[getRandomInteger(0, this.titles.length - 1)];
  },
  generateFullTitle() {
    return this.fullTitles[getRandomInteger(0, this.fullTitles.length - 1)];
  },
  generatePoster() {
    return this.posters[getRandomInteger(0, this.posters.length - 1)];
  },
  generateDirector() {
    return this.directors[getRandomInteger(0, this.directors.length - 1)];
  },
  generateWriters() {
    const countWriters = getRandomInteger(1, 2);
    return getRandomiseArray(this.writers, countWriters);
  },
  generateActors() {
    return getRandomiseArray(this.actors, this.actors.length - 1);
  },
  generateGenre() {
    const countGenre = getRandomInteger(1, 3);
    return getRandomiseArray(this.genre, countGenre);
  },
  generateDescription() {
    const descriptionSentenceMin = 1;
    const descriptionSentenceMax = 5;
    const descriptionArray = this.description.split('.')
      .map((text) => text.trim())
      .filter((text) => text.length > 0);

    const randomCountDescriptionSentence = getRandomInteger(descriptionSentenceMin, descriptionSentenceMax);
    const randomDescriptionArray = getRandomiseArray(descriptionArray, randomCountDescriptionSentence);
    return `${randomDescriptionArray.join('. ').trim()}.`;
  },
  generateDate() {
    const daysGap = getRandomInteger(31, 365);
    return (
      Date.now() - Math.floor(Math.random() * daysGap) * 24 * 60 * 60 * 1000
    );
  },
  generateCountry() {
    return this.countries[getRandomInteger(0, this.countries.length - 1)];
  },
  generateRelease() {
    return {
      date: this.generateDate(),
      releaseCountry: this.generateCountry(),
    };
  },
};

export const generateFilm = () => ({
  title: mockData.generateTitle(),
  alternativeTitle: mockData.generateFullTitle(),
  totalRating: 5.3,
  poster: `images/posters/${mockData.generatePoster()}`,
  ageRating: 0,
  director: mockData.generateDirector(),
  writers: mockData.generateWriters(),
  actors: mockData.generateActors(),
  release: mockData.generateRelease(),
  runtime: getRandomInteger(45, 230),
  genre: mockData.generateGenre(),
  description: mockData.generateDescription(),
});