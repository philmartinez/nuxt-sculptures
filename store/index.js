export const state = () => ({
    page: 'index',
    loaded: false,
    items: [
        {
            name: 'S3',
            type: 'snapper',
            image: 'fish.png',
            bg_color: '#ffd493',
            font_color: '#e4ba7b',
            id: 1
        },
        {
            name: 'W9',
            type: 'bowhead',
            image: 'whale.png',
            bg_color: '#8198ff',
            font_color: '#c1c1f1',
            id: 2
        },
        {
            name: 'G4',
            type: 'grouper',
            image: 'fish2.png',
            bg_color: '#e4434f',
            font_color: '#ff561a',
            id: 3
        },
        {
            name: 'W2',
            type: 'bowhead',
            image: 'fish4.png',
            bg_color: '#f9f9c5',
            font_color: '#333',
            id: 4
        }
    ]
})

export const mutations = {
    updatePage (state, pageName) {
        state.page = pageName
    },
    updateLoaded(state, loaded) {
        state.loaded = loaded
    }
}