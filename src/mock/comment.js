import {getRandomInteger, getRandomiseArray} from '../utils/utils.js';


const mockData = {
  authors: [
    'Amelia Oliver',
    'Heather Williams',
    'Jessica Grace',
    'Jack Davis',
  ],
  commentText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  emotions: [
    'smile',
    'sleeping',
    'puke',
    'angry',
  ],
  generateAuthor() {
    return this.authors[getRandomInteger(0, this.authors.length - 1)];
  },
  generateCommentText() {
    const commentSentenceMin = 1;
    const commentSentenceMax = 2;

    const commentArray = this.commentText.split('.')
      .map((text) => text.trim())
      .filter((text) => text.length > 0);

    const randomCountCommentSentence = getRandomInteger(commentSentenceMin, commentSentenceMax);
    const randomCommentArray = getRandomiseArray(commentArray, randomCountCommentSentence);
    return `${randomCommentArray.join('. ').trim()}.`;
  },
  generateDate() {
    const daysGap = getRandomInteger(31, 365);
    return (
      Date.now() - Math.floor(Math.random() * daysGap) * 24 * 60 * 60 * 1000
    );
  },
  generateEmotion() {
    return this.emotions[getRandomInteger(0, this.emotions.length - 1)];
  },
};

export const generateComment = () => ({
  author: mockData.generateAuthor(),
  comment: mockData.generateCommentText(),
  date: mockData.generateDate(),
  emotion: mockData.generateEmotion(),
});
