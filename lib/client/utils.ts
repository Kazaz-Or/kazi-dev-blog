import searchIndex from '@content/search/index.json';


const getLocalSearchIndex = () => {
    return searchIndex;
}

const shortify = (text: string, maxLength = 146) => {
    if (text.length <= maxLength) {
        return text;
    } else {
        return text.substring(0, maxLength) + " ...";
    }
}

export { getLocalSearchIndex, shortify }

