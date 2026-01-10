import { useParams } from 'react-router-dom'
import BackHeader from '../components/Backheader'

const Watch = () => {
  const { media, id, s = 1, e = 1 } = useParams();

  const src =
    media === 'tv'
      ? `https://www.vidking.net/embed/tv/${id}/${s}/${e}?color=009689&autoPlay=true&nextEpisode=true&episodeSelector=true`
      : `https://www.vidking.net/embed/movie/${id}?color=009689&autoPlay=true`

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <BackHeader title="Watch" />

      <iframe
        src={src}
        className="w-full h-[calc(100vh-64px)]"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation"
      />
    </div>
  )
}

export default Watch
