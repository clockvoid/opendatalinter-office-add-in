import { useState } from "react";
import { useHistory } from "react-router-dom";
import * as React from "react";

const ResultList = (props) => {
  let history = useHistory();

  return (
    <div>
      <div className="resultList">
        <h2 className="resultListHeadline">形式チェック</h2>
        <p className="resultListDescription">{ props.file !== undefined && props.file.name }</p>
        <ul className="resultListListcontenter">
          <>
            {props.results.map((result) =>
            <ResultItem key={result.no} result={result} />
            )}
          </>
        </ul>
      </div>

      <div style={{textAlign: "center"}}>
        <button className="fileUploaderbutton" onClick={() => history.goBack()}>再アップロードする</button>
      </div>
    </div>
  );
}

const ResultItem = (props) => {

  const key = props.result.no;
  const item = props.result.item;
  const isValid = props.result.is_valid;
  const invalid_content_list = props.result.invalid_contents;
  const invalid_contents = invalid_content_list !== undefined ? invalid_content_list[0] : undefined;
  const message = invalid_contents !== undefined ? invalid_contents.error_message : undefined;
  const cells = invalid_contents !== undefined ? invalid_contents.invalid_cells : undefined;
  const [accordion, setAccordion] = useState(true)

  if (isValid === true) {
  // ok
    return (
      <li className="resultListListItem" key={key + "1"}>
        <div className="resultListListHeadline" key={key + "2"}>
          <span className="material-icons resultListListIcon resultListListIconChecked" key={key + "3"}>check_circle</span>
          <p className="resultListListTitle" key={key + "4"}>{item}</p>
        </div>
      </li>
    );
  } else if (isValid === false) { 
  // だめなセルが存在
    if (cells === undefined) {
      return (
        <li className="resultListListItem" key={key + "5"}>
          <div className="resultListListHeadline" key={key + "6"}>
            <span className="material-icons resultListListIcon resultListListIconError" key={key + "7"}>block</span>
            <p className="resultListListTitle" key={key + "8"}>{item}</p>
          </div>
        </li>
      );
    }
    if (message === undefined) {
      return (
        <li className="resultListListItem" key={key + "9"}>
          <button className="resultListListLabel" key={key + "10"} onClick={() => {
            setAccordion(!accordion)
          }}>
            <span className="material-icons resultListListIcon resultListListIconError" key={key + "11"}>block</span>
            <p className="resultListListTitle" key={key + "12"}>{item}</p>
            <span className="material-icons" key={key + "13"}>{accordion ? 'expand_more' : 'expand_less'}</span>
          </button>
          <div className="resultListListContents" style={accordion ? ({ display: "block" }) : ({ display: "none" })} key={key + "14"}>
            <div className="resultListListContentsErrors" key={key + "15"}>
              {cells.map((cell, index) =>
                <span className="resultListListContentsError" key={key + "16" + index.toString()}>{cell[0]}行{cell[1]}列,</span>
              )}
            </div>
          </div>
        </li>
      );
    }
    return (
      <li className="resultListListItem" key={key + "17"}>
        <button className="resultListListLabel" key={key + "18"} onClick={() => {
            setAccordion(!accordion)
          }} >
          <span className="material-icons resultListListIcon resultListListIconError" key={key + "19"}>block</span>
          <p className="resultListListTitle" key={key + "20"}>{item}</p>
          <span className="material-icons" key={key + "21"}>{accordion ? 'expand_more' : 'expand_less'}</span>
        </button>
        <div className="resultListListContents" key={key + "22"} style={accordion ? ({ display: "block" }) : ({ display: "none" })}>
          <p className="resultListListContentsErrorTitle" key={key + "23"}>{message}</p>
          <div className="resultListListContentsErrors" key={key + "24"}>
            {cells.map((cell, index) =>
              <span className="resultListListContentsError" key={key + "25" + index.toString()}>{cell[0]}行 {cell[1]}列,</span>
            )}
          </div>
        </div>
      </li>
    );
  } else if (isValid === null) {
    return (
      <li className="resultListListItem" key={key + "26"}>
        <div className="resultListListHeadline" key={key + "27"}>
          <span className="material-icons-outlined resultListListIcon resultListListIconBlocked" key={key + "28"}>remove_circle_outline</span>
          <p className="resultListListTitle" key={key + "29"}>{item}</p>
        </div>
        <div className="resultListListContents" key={key + "30"}>
          <p className="resultListListContentsBlocked" key={key + "31"}>ファイル形式が間違っているためチェックできません</p>
        </div>
      </li>
    );
  };

  return (
    <li className="resultListListItem" key={key + "32"}>
      <div className="resultListListHeadline" key={key + "33"}>
        <span className="material-icons-outlined resultListListIcon resultListListIconWaiting" key={key + "33"}>circle</span>
        <p className="resultListListTitle" key={key + "34"}>{item}</p>
      </div>
    </li>
  );
}

export default ResultList;
