import { useState } from "react";
import { useHistory } from "react-router-dom";
import * as React from "react";

const ResultList = (props) => {
  return (
    <div>
      <div className="resultList">
        <h2 className="resultListHeadline">形式チェック</h2>
        <p className="resultListDescription">
        { props.file !== undefined && props.file.name !== undefined && props.file.name }
        { props.file !== undefined && props.file.fileName !== undefined && props.file.fileName }
        </p>
        <ul className="resultListListcontenter">
          <>
            {props.results.map((result) =>
            <ResultItem key={result.no} result={result} />
            )}
          </>
        </ul>
      </div>

      <div style={{textAlign: "center"}}>
        <button className="fileUploaderbutton" onClick={() => props.goBack()}>再チェックする</button>
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

  const encodeRow = (row) => {
    var quo = row;
    var colStr = "";

    do {
      var letter = String.fromCharCode('A'.charCodeAt() + (quo - 1) % 26);
      quo = Math.floor((quo - 1) / 26);
      colStr = letter + colStr;
    } while (quo >= 1);

    return colStr;
  }

  const moveTo = async (column, row) => {
    try {
      await Excel.run(async (context) => {
        var sheet = context.workbook.worksheets.getActiveWorksheet();

        var range;
        // どっちかnullしかこない
        if (column === null) {
          var encodedRow = encodeRow(row);
          range = sheet.getRange(encodedRow + ':' + encodedRow);
        } else if (row === null) {
          range = sheet.getRange(row.toString() + ':' + row.toString());
        } else {
          range = sheet.getCell(column - 1, row - 1);
        }
        range.select();

        return context.sync();
      });
    } catch (error) {
      console.error(error);
    }
  };

  const comment = async (column, row, message) => {
    if (column === null || row === null) return;
    try {
      await Excel.run(async (context) => {
        var comments = context.workbook.comments;

        //comments.getItemByCell(encodeRow(row) + column.toString()).delete()

        var address = encodeRow(row) + column.toString();
        console.log(column, row);
        comments.add(address, message);

        return context.sync();
      });
    } catch (error) {
      console.error(error);
    }
  }

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
              <button className="resultListListLabel" onClick={() => moveTo(cell[0], cell[1])} key={key + "35"}>
                <span className="resultListListContentsError" key={key + "25" + index.toString()}>
                  {cell[0]}{cell[0] !== null && "行"}{cell[1]}{cell[1] !== null && "列"},
                </span>
              </button>
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
            <button className="resultListListLabel" onClick={() => moveTo(cell[0], cell[1])} key={key + "36"}>
              <span className="resultListListContentsError" key={key + "25" + index.toString()}>
                {cell[0]}{cell[0] !== null && "行"}{cell[1]}{cell[1] !== null && "列"},
              </span>
            </button>
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
