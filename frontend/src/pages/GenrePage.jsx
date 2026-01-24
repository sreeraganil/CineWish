import { useEffect } from "react";
import { useParams } from "react-router-dom";
import genreStore from "../store/genreStore";
import GenreGrid from "../components/GenreGrid";
import BackHeader from "../components/Backheader";
import GENRE from '../utilities/genres.json'

const GenrePage = () => {
  const { id } = useParams();

  const title = GENRE.find(genre => genre.id == id)?.name;

  const { items, page, totalPages, loading, fetchGenre, resetGenre } =
    genreStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    resetGenre();
    fetchGenre({ genreId: id, page: 1 });

    return resetGenre;
  }, [id]);

  return (
    <>
      <BackHeader title={title} />
      <div className="min-h-screen bg-slate-950 px-6 text-white">
        <GenreGrid
          items={items}
          loading={loading}
          hasMore={page < totalPages}
          onLoadMore={() =>
            fetchGenre({
              genreId: id,
              page: page + 1,
            })
          }
        />
      </div>
    </>
  );
};

export default GenrePage;
