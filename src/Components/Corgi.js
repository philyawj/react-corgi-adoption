import React, { Component } from "react";

export class Corgi extends Component {
  render() {
    const {
      name,
      sex,
      age,
      city,
      address,
      state,
      zip,
      description,
      email,
      phone,
      photo,
      breed,
      options,
      id
    } = this.props.details;
    return (
      <div className="container">
        <div className="card card-body mb-3">
          <div className="row">
            <div className="col-sm-12 col-md-5 text-center mb-4 mb-md-0">
              <img
                className="crop img-fluid rounded-circle"
                src={photo}
                alt={`pet named ${name}`}
              />
            </div>
            <div className="col-sm-12 col-md-7">
              <ul className="list-group">
                <li className="list-group-item lead text-primary">{name}</li>
                <li className="list-group-item">
                  {sex === "M" ? (
                    <i className="fas fa-mars text-primary" />
                  ) : (
                    <i className="fas fa-venus text-primary" />
                  )}
                  &nbsp;{age} {sex === "M" ? "Male" : "Female"}
                </li>
                {breed && (
                  <li className="list-group-item">
                    <i className="fas fa-paw text-primary" /> {breed}
                  </li>
                )}
                {Object.values(options).map(val => {
                  return (
                    <li className="list-group-item" key={val}>
                      {this.props.handleOptionConversion(val, sex)}
                    </li>
                  );
                })}
                <li className="list-group-item">
                  <i className="fas fa-map-marker-alt text-primary" />&nbsp;
                  {address && `${address}, `}
                  {city}, {state} {zip}
                </li>
                <li className="list-group-item">
                  <i className="fas fa-info-circle text-primary" /> ID: {id}
                </li>
                {email && (
                  <li className="list-group-item">
                    <i className="fas fa-envelope text-primary" />{" "}
                    <span className="email-info-text">
                      <a
                        href={`mailto:${email}?Subject=Interested%20in%20adopting%20${name} - ID:${id}`}
                        target="_top"
                      >
                        {email}
                      </a>
                    </span>
                  </li>
                )}
                {phone && (
                  <li className="list-group-item">
                    <i className="fas fa-phone text-primary" /> {phone}
                  </li>
                )}
              </ul>
              <div className="btn-container">
                {description && (
                  <button
                    className="btn btn-primary btn-sm mt-3"
                    type="button"
                    data-toggle="collapse"
                    data-target={`#story-${this.props.index}`}
                    aria-expanded="false"
                    aria-controls="collapseExample"
                  >
                    {name + `'s Story`}
                  </button>
                )}
              </div>
            </div>
            <div
              className="collapse col-sm-12"
              id={`story-${this.props.index}`}
            >
              <div className="card card-body pb-1 mt-3">
                <p>{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Corgi;
