export const state = () => ({
    page: 'index',
    loaded: false,
    items: [
        {
            name: 'S3',
            type: 'snapper',
            price: '$2,200',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sapien ligula, ultricies eget luctus eget, pretium ut erat. Vivamus nulla justo, rhoncus sit amet massa et, commodo finibus nisl.',
            image: 'fish.png',
            bg_color: '#ffd493',
            font_color: '#e4ba7b',
            artist: 'Ernesto',
            id: 1
        },
        {
            name: 'W9',
            type: 'bowhead',
            price: '$2,200',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sapien ligula, ultricies eget luctus eget, pretium ut erat. Vivamus nulla justo, rhoncus sit amet massa et, commodo finibus nisl.',
            image: 'whale.png',
            bg_color: '#8198ff',
            font_color: '#c1c1f1',
            artist: 'Ernesto',
            id: 2
        },
        {
            name: 'G4',
            type: 'grouper',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sapien ligula, ultricies eget luctus eget, pretium ut erat. Vivamus nulla justo, rhoncus sit amet massa et, commodo finibus nisl.',
            price: '$2,400',
            image: 'fish2.png',
            bg_color: '#e4434f',
            font_color: '#ff561a',
            artist: 'Ernesto',
            id: 3
        },
        {
            name: 'W2',
            type: 'bowhead',
            price: '$2,200',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sapien ligula, ultricies eget luctus eget, pretium ut erat. Vivamus nulla justo, rhoncus sit amet massa et, commodo finibus nisl.',
            image: 'fish4.png',
            bg_color: '#f9f9c5',
            font_color: '#333',
            artist: 'Ernesto',
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