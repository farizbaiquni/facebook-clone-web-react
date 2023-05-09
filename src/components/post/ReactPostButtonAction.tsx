import { reactEnum } from "../../constants/EntityType";
import {
  CommentButton,
  LikeButton,
  ShareButton,
} from "../../commonComponents/icons/reactButtonAction";

type propsType = {
  changingReactOnProgress: boolean;
  currentReactStatus: reactEnum | undefined;
  handleChangeReact: (value: reactEnum) => void;
};

export default function ReactPostButtonAction(props: propsType) {
  return (
    <div className="flex justify-center border-y-2 border-gray-300 py-1">
      <span
        className="flex h-full w-full cursor-pointer justify-center rounded-md py-1 hover:bg-gray-200"
        onClick={() => props.handleChangeReact(reactEnum.LIKE)}
      >
        {props.changingReactOnProgress ? (
          <img src={process.env.PUBLIC_URL + "./loading_blue.gif"} alt="" className="h-6 w-6" />
        ) : props.currentReactStatus === undefined ? (
          <LikeButton likeStatus={false} />
        ) : (
          <LikeButton likeStatus={true} />
        )}
      </span>

      <CommentButton />
      <ShareButton />
    </div>
  );
}
