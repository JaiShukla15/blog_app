import { useEffect, useState } from "react";
import { BASE_URL } from "../../constant";
import Dialog from "../Dialog/Dialog";
import Text from "../UI/Text";
import { useHistory } from "react-router-dom";

const Blogs = function () {
  const [blogs, setBlogs] = useState([]);
  const [filterredBlogs, setFilterredBlogs] = useState([]);
  const [searchItem, setSearch] = useState("");
  const [readMore, setRead] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const history = useHistory();
  async function getPosts() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${BASE_URL}/posts`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        });
        const jsonResponse = await response.json();
        if (jsonResponse) {
          resolve(jsonResponse);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  const updateReadState = ({ title, description }) => {
    setTitle(title);
    setDescription(description);
    setRead(true);
  };
  const searchHandler = (value) => {
    value = value.toLowerCase();
    setSearch(value);
    const filterred = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(value)
    );
    setFilterredBlogs(filterred);
  };
  useEffect(() => {
    getPosts()
      .then((data) => {
        if (data.message) {
          history.push("/auth/login");
        }
        if (data) {
          setBlogs([...data?.result]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [filterredBlogs]);
  return (
    <>
      {readMore && (
        <Dialog
          hide={() => setRead(false)}
          title={title}
          description={description}
        />
      )}
      <div className="text-center my-4">
        <Text name="search" type="text" keyPressHandler={searchHandler} />
        {searchItem && (<h4 className="my-2 display-5">{filterredBlogs.length} Records Found</h4>)}
        {!searchItem ? (
          blogs.length ? (
            blogs.map((item) => {
              return (
                <div
                  className="card my-4"
                  key={item.id}
                  style={{ width: "18rem;" }}
                >
                  {/* <img className="card-img-top"src="https://www.istockphoto.com/photo/content-marketing-content-data-blogging-media-publication-information-vision-concept-gm976370312-265552361?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fblog&utm_term=blog%3A%3A%3A"/> */}
                  <div className="card-body">
                    <h5 className="card-title">{item?.title}</h5>
                    <p className="card-text">{item?.description}</p>
                    <p> Likes : {item?.post_likes?.length || 0}</p>
                    <a
                      onClick={() => updateReadState(item)}
                      className="btn btn-primary"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <h4 className="my-5">No Posts available !</h4>
          )
        ) : filterredBlogs.length ? (
          filterredBlogs.map((item) => {
            return (
              <div
                className="card my-4"
                key={item.id}
                style={{ width: "18rem;" }}
              >
                {/* <img className="card-img-top"src="https://www.istockphoto.com/photo/content-marketing-content-data-blogging-media-publication-information-vision-concept-gm976370312-265552361?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fblog&utm_term=blog%3A%3A%3A"/> */}
                <div className="card-body">
                  <h5 className="card-title">{item?.title}</h5>
                  <p className="card-text">{item?.description}</p>
                  <p> Likes : {item?.post_likes?.length || 0}</p>

                  <a
                    onClick={() => updateReadState(item)}
                    className="btn btn-primary"
                  >
                    Read More
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <h4 className="my-5">No Search available </h4>
        )}
      </div>
    </>
  );
};
export default Blogs;
