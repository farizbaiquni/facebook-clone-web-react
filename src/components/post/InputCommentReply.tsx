import { ChangeEvent, useEffect, useState } from "react";

function InputCommentReply() {
  const imageMimeType = /image\/(png|jpg|jpeg)/i;

  const [file, setFile] = useState<File | null>(null);
  const [fileDataURL, setFileDataURL] = useState<string | null>(null);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file && !file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFile(file || null);
  };

  const removeImage = () => {
    setFile(null);
    setFileDataURL(null);
  };

  useEffect(() => {
    let fileReader: FileReader | null;
    let isCancel = false;

    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target as FileReader;
        if (result && !isCancel) {
          setFileDataURL(result.toString());
        }
      };
      fileReader.readAsDataURL(file);
    }

    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  return (
    <div className="mt-3 flex py-2">
      <img
        src={process.env.PUBLIC_URL + "./profile.jpg"}
        alt=""
        className=" mr-2 h-8 w-8 rounded-full"
      />
      <div className="flex w-full flex-col">
        <div className="flex flex-1 flex-col rounded-xl bg-gray-100 px-3 py-2 focus:outline-none">
          <input
            type="text"
            placeholder="Write a comment..."
            className="mt-2 h-full w-full bg-gray-100 focus:outline-none"
          />

          <div className="mb-2 mt-5 flex justify-between">
            <div className="flex">
              <img
                src={process.env.PUBLIC_URL + "./icons/user.png"}
                alt=""
                className={`mr-2 h-5 w-5 cursor-pointer fill-slate-500 ${fileDataURL && "hidden"}`}
              />
              <img
                src={process.env.PUBLIC_URL + "./icons/emoji.png"}
                alt=""
                className="mr-2 h-5 w-5 cursor-pointer"
              />
              <div className={`mr-2 ${fileDataURL && "hidden"}`}>
                <input
                  className="hidden h-5 w-5 bg-blue-500"
                  type="file"
                  id="upload-image"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => changeHandler(e)}
                />
                <label htmlFor="upload-image">
                  <img
                    src={process.env.PUBLIC_URL + "./icons/camera.png"}
                    alt=""
                    className="h-5 w-5 cursor-pointer"
                  />
                </label>
              </div>
              <img
                src={process.env.PUBLIC_URL + "./icons/gif.png"}
                alt=""
                className={`mr-2 h-5 w-5 cursor-pointer fill-slate-500 ${fileDataURL && "hidden"}`}
              />
              <img
                src={process.env.PUBLIC_URL + "./icons/sticker.png"}
                alt=""
                className={`h-5 w-5 -rotate-12  cursor-pointer fill-slate-500 ${
                  fileDataURL && "hidden"
                }`}
              />
            </div>
            <img
              src={process.env.PUBLIC_URL + "./icons/send.png"}
              alt=""
              className={`h-5 w-5 cursor-pointer fill-slate-500 ${fileDataURL && "hidden"}`}
            />
          </div>
        </div>
        {fileDataURL && (
          <div className="mt-2 flex w-full justify-between">
            <img src={fileDataURL} alt="preview" className="h-28 w-40 object-cover" />
            <img
              onClick={() => removeImage()}
              src={process.env.PUBLIC_URL + "./icons/close.png"}
              alt=""
              className="mx-2 h-7 w-7 cursor-pointer rounded-full bg-slate-300 p-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default InputCommentReply;
