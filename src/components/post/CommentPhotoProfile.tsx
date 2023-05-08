type PropsType = {
  isQueryError: boolean;
};

function CommentPhotoProfile(props: PropsType) {
  return (
    <div>
      <span className=" relative top-0 left-0 bg-blue-500">
        <img
          src={process.env.PUBLIC_URL + "./profile.jpg"}
          alt=""
          className=" mr-2 h-8 w-8 rounded-full"
        />
        {props.isQueryError && (
          <span className=" absolute top-1/3 right-0 rounded-full bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="red"
              className=" m-1 h-4 w-4"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
            </svg>
          </span>
        )}
      </span>
    </div>
  );
}

export default CommentPhotoProfile;
