export type Video = {
    url: string;
    image: string;
    name: string;
    description: string;
}

const videos: Video[] = [
    {
        url: "assets/video/video01.mp4",
        image: "assets/image/video01.jpg",
        description: "Video do filme elephants' dreams",
        name: "Elephants's dreams"
    },
    {
        url: "assets/video/video02.mp4",
        image: "assets/image/video02.jpg",
        description: "Video de um gato!",
        name: "Gato"
    }
]

export default videos;