import React from "react";

const ShowMore = props => {
  return (
    <div>
      {props.showMore && (
        <div className="container text-center pb-4 mt-4">
          <button
            className="btn btn-primary btn-lg"
            onClick={props.fetchMoreCorgis}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowMore;
