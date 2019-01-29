import React, { Component } from "react";

export class Form extends Component {
  render() {
    return (
      <div className="container">
        {this.props.errorZipShow && (
          <div
            data-aos-duration="500"
            data-aos="fade-up"
            className="alert alert-primary mt-3 mb-0"
            id={this.props.errorZipFade === true ? "fade-out-results" : ""}
            role="alert"
          >
            Please enter a valid 5 digit zip code.
          </div>
        )}

        {this.props.errorResultsShow && (
          <div
            data-aos-duration="500"
            data-aos="fade-up"
            className="alert alert-primary mt-3 mb-0"
            id={this.props.errorResultsFade === true ? "fade-out-results" : ""}
            role="alert"
          >
            No corgis near that zip code.
          </div>
        )}

        <form id="pet-form" onSubmit={this.props.fetchCorgis} className="mt-3">
          <div className="form-group">
            <input
              type="tel"
              id="zip"
              name="location"
              className="form-control form-control-lg mb-3"
              placeholder="Zip Code"
              onChange={this.props.handleZipInput}
            />
            <input
              type="submit"
              value="Find"
              className="btn btn-primary btn-lg btn-block mt-3"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default Form;
