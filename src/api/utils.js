import { RankTypes } from './conf';

export const getCount = count => {
  if (count < 0) return;
  if (count < 10000) {
    return count;
  } else if (Math.floor(count / 10000) < 10000) {
    return Math.floor(count / 1000) / 10 + '万';
  } else {
    return Math.floor(count / 10000000) / 10 + '亿';
  }
};

export const debounce = (func, delay) => {
  let timer;
  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
      clearTimeout(timer);
    }, delay);
  };
};

export const filterIndex = rankList => {
  const globalStartIndex = rankList.findIndex(
    (item, i) =>
      item.tracks && item.tracks.length && !rankList[i + 1].tracks.length
  );
  let officialList = rankList.slice(0, globalStartIndex + 1);
  let globalList = rankList.slice(globalStartIndex + 1);
  return [officialList, globalList];
};

//找出排行榜的编号
export const filterIdx = name => {
  for (var key in RankTypes) {
    if (RankTypes[key] === name) return key;
  }
  return null;
};

// 处理歌手列表拼接歌手名字
export const getName = list => {
  let str = '';
  list.map((item, index) => {
    str += index === 0 ? item.name : '/' + item.name;
    return item;
  });
  return str;
};

export const isEmptyObject = obj => !obj || Object.keys(obj).length === 0;
