import { Fragment, memo, useEffect, useState } from "react";
import { reactEnum, totalReactPostType } from "../../constants/EntityType";
import { CareIcon, LikeIcon, LoveIcon } from "../../commonComponents/icons/reacts";

type PropsType = {
  currentReactStatus: reactEnum | undefined;
  totalReactPost: totalReactPostType;
};

function ReactPostCount(props: PropsType) {
  type displayedReactType = { type: reactEnum; total: number };
  const [isLoading, setIsLoading] = useState(true);
  const [reactTotal, setReactTotal] = useState<string | null | undefined>(null);
  const [shareTotal, setShareTotal] = useState<string | null | undefined>(null);
  const [displayedReact, setDisplayedReact] = useState<
    Array<displayedReactType> | null | undefined
  >(null);
  const [helpTrigger, setHelpTrigger] = useState(false);

  const formatCompactNumber = async (number: number): Promise<string | null | undefined> => {
    if (number <= 0) {
      return undefined;
    }
    if (number < 1000) {
      return number.toString() ?? "0";
    } else if (number >= 1000 && number < 1_000_000) {
      return (number / 1000).toFixed(1) + "K";
    } else if (number >= 1_000_000 && number < 1_000_000_000) {
      return (number / 1_000_000).toFixed(1) + "M";
    } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
      return (number / 1_000_000_000).toFixed(1) + "B";
    } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
      return (number / 1_000_000_000_000).toFixed(1) + "T";
    }
  };

  const calculateDisplayedReact = async (
    totalReact: number,
    arrReact: Array<displayedReactType>
  ): Promise<Array<displayedReactType> | undefined> => {
    if (totalReact <= 0) return undefined;
    let tempResult: Array<displayedReactType> = [];
    function calculate(value: number, react: reactEnum) {
      if (value <= 0) return;
      if (tempResult.length < 2) {
        tempResult.push({ type: react, total: value });
      } else {
        const lowestIndex: number = tempResult[0].total > tempResult[1].total ? 1 : 0;
        if (value > tempResult[lowestIndex].total) {
          tempResult[lowestIndex] = { type: react, total: value };
        }
      }
    }
    arrReact.map((data) => {
      calculate(data.total, data.type);
    });
    return tempResult;
  };

  const handleDisplayedReact = async () => {
    const arrayReact = [
      { type: reactEnum.LIKE, total: props.totalReactPost.totalLike },
      { type: reactEnum.LOVE, total: props.totalReactPost.totalLove },
      { type: reactEnum.CARE, total: props.totalReactPost.totalCare },
      { type: reactEnum.HAHA, total: props.totalReactPost.totalHaha },
      { type: reactEnum.WOW, total: props.totalReactPost.totalWow },
      { type: reactEnum.SAD, total: props.totalReactPost.totalSad },
      { type: reactEnum.ANGRY, total: props.totalReactPost.totalAngry },
    ];
    const tempDisplayedReact = await calculateDisplayedReact(
      props.totalReactPost.totalReact,
      arrayReact
    );
    setDisplayedReact(tempDisplayedReact);
    setHelpTrigger((prevState) => !prevState);
  };

  const convertNumberToCompact = async (totalReact: number, totalShare: number) => {
    setIsLoading(true);
    const tempReactTotal = await formatCompactNumber(totalReact);
    const tempShareTotal = await formatCompactNumber(totalShare);
    setReactTotal(tempReactTotal);
    setShareTotal(tempShareTotal);
    setIsLoading(false);
  };

  useEffect(() => {
    handleDisplayedReact();
  }, [props.totalReactPost]);

  useEffect(() => {
    convertNumberToCompact(props.totalReactPost.totalReact, props.totalReactPost.totalShare);
  }, [props.totalReactPost.totalReact, props.totalReactPost.totalShare]);

  return (
    <Fragment>
      {isLoading ? (
        <div className="flex justify-center">
          <img src={process.env.PUBLIC_URL + "./loading_blue.gif"} alt="" className="h-6 w-6" />
        </div>
      ) : (
        <div className="my-4 flex justify-between">
          <div className="flex">
            {displayedReact != null &&
              displayedReact.map((react) => {
                return react.type === reactEnum.LIKE ? (
                  <LikeIcon key={react.type} />
                ) : react.type === reactEnum.LOVE ? (
                  <LoveIcon key={react.type} />
                ) : (
                  <CareIcon key={react.type} />
                );
              })}
            {props.currentReactStatus !== undefined && (
              <p className=" mx-1 text-slate-600">You and</p>
            )}
            {reactTotal != null && <p className=" text-slate-600">{reactTotal}</p>}
            {props.currentReactStatus !== undefined && (
              <p className=" mx-1 text-slate-600">
                {props.totalReactPost.totalReact > 1 ? "others" : "other"}
              </p>
            )}
          </div>
          <div className="flex">
            <p className="text-slate-600">3k comments &nbsp;</p>
            {shareTotal != null && (
              <p className="text-slate-600">
                {shareTotal} {props.totalReactPost.totalShare > 1 ? "shares" : "share"}
              </p>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default memo(ReactPostCount);
