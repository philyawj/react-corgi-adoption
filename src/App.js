import React, { Component } from "react";
import _ from "lodash";
import uuid from "uuid";
import fetchJsonp from "fetch-jsonp";
import Corgi from "./Components/Corgi";
import ShowMore from "./Components/ShowMore";
import Form from "./Components/Form";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

class App extends Component {
  state = {
    corgis: {},
    lastOffset: 0,
    totalResults: 0,
    showMore: false,
    location: "",
    errorZipShow: false,
    errorZipFade: false,
    errorResultsShow: false,
    errorResultsFade: false
  };

  isValidZip = zip => {
    return /^\d{5}?$/.test(zip);
  };

  handleZipInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });

    if (!_.isEmpty(this.state.corgis)) {
      this.setState({
        corgis: {},
        showMore: false
      });
    }
  };

  toTitleCase = str => {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  handleNum = str => {
    if (str.match(/\d/)) {
      return "Cute Corgi";
    } else {
      return str;
    }
  };

  totalResults = results => {
    // console.log(results + " Total results");
    this.setState({
      totalResults: results
    });

    if (!_.isEmpty(this.state.corgis)) {
      this.setState({
        showMore: true
      });
    }
  };

  noResultsHandle = err => {
    this.setState({
      errorResultsShow: true
    });
    setTimeout(() => {
      this.setState({
        errorResultsFade: true
      });
    }, 2500);
    setTimeout(() => {
      this.setState({
        errorResultsShow: false,
        errorResultsFade: false
      });
    }, 3000);
    // console.log(String(errStr));
  };

  handleOptionConversion = (option, sex) => {
    if (option === "altered" && sex === "M") {
      return (
        <span>
          <i className="fas fa-check text-primary" /> Neutered
        </span>
      );
    } else if (option === "altered" && sex === "F") {
      return (
        <span>
          <i className="fas fa-check text-primary" /> Spayed
        </span>
      );
    } else if (option === "noDogs") {
      return (
        <span>
          <i className="fas fa-times text-primary" /> &nbsp;No Dogs
        </span>
      );
    } else if (option === "noCats") {
      return (
        <span>
          <i className="fas fa-times text-primary" /> &nbsp;No Cats
        </span>
      );
    } else if (option === "housetrained") {
      return (
        <span>
          <i className="fas fa-check text-primary" /> Housebroken
        </span>
      );
    } else if (option === "noKids") {
      return (
        <span>
          <i className="fas fa-times text-primary" /> &nbsp;No Kids
        </span>
      );
    } else if (option === "specialNeeds") {
      return (
        <span>
          <i className="fas fa-wheelchair text-primary" /> Special Needs
        </span>
      );
    } else if (option === "hasShots") {
      return (
        <span>
          <i className="fas fa-check text-primary" /> Has Shots
        </span>
      );
    }
  };

  processCorgis = data => {
    // all the data, including the offset

    // set offset state
    this.setState({
      lastOffset: data.lastOffset.$t
    });

    // only the pet object to loop through
    let corgis = data.pets.pet;

    // copy of the previous state
    let corgiState = { ...this.state.corgis };

    corgis.forEach((corgi, index) => {
      // ITEMS THAT NEED PROCESSING

      // photo: if empty assign placeholder - otherwise, get the photo
      let corgiPhoto;
      if (_.isEmpty(corgis[index].media)) {
        corgiPhoto = "./img/no-image.jpg";
      } else {
        corgiPhoto = corgis[index].media.photos.photo[3].$t;
      }

      // get breed
      let corgiBreed;
      if (corgis[index].breeds.breed.$t) {
        corgiBreed = corgis[index].breeds.breed.$t;
      } else if (corgis[index].breeds.breed[0].$t !== "Pembroke Welsh Corgi") {
        corgiBreed = corgis[index].breeds.breed[0].$t;
      } else if (corgis[index].breeds.breed[1].$t !== "Pembroke Welsh Corgi") {
        corgiBreed = corgis[index].breeds.breed[1].$t;
      }
      // then format breed
      if (
        corgiBreed === "Pembroke Welsh Corgi" ||
        corgiBreed === "Mixed Breed"
      ) {
        corgiBreed = "";
      } else {
        corgiBreed = `${corgiBreed} Mix`;
      }

      // and then add a handleOptions conversion to both
      let corgiOptions;
      if (_.isEmpty(corgis[index].options.option)) {
        corgiOptions = {};
      } else if (corgis[index].options.option.$t) {
        corgiOptions = {
          0: corgis[index].options.option.$t
        };
      } else {
        corgiOptions = _.mapValues(corgis[index].options.option, "$t");
      }

      let newCorgi = {
        name: this.handleNum(this.toTitleCase(corgis[index].name.$t)),
        sex: corgis[index].sex.$t,
        age: corgis[index].age.$t,
        city: corgis[index].contact.city.$t,
        address: corgis[index].contact.address1.$t,
        state: corgis[index].contact.state.$t,
        zip: corgis[index].contact.zip.$t,
        description: corgis[index].description.$t,
        email: corgis[index].contact.email.$t,
        phone: corgis[index].contact.phone.$t,
        photo: corgiPhoto,
        breed: corgiBreed,
        options: corgiOptions,
        id: corgis[index].id.$t
      };
      corgiState[`corgi${uuid()}`] = newCorgi;
    });

    this.setState({
      corgis: corgiState
    });

    if (this.state.lastOffset === this.state.totalResults) {
      this.setState({
        showMore: false
      });
    }
  };

  fetchCorgis = e => {
    e.preventDefault();

    document.getElementById("zip").blur();

    if (!this.isValidZip(this.state.location)) {
      setTimeout(() => {
        this.setState({
          errorZipShow: true
        });
        setTimeout(() => {
          this.setState({
            errorZipFade: true
          });
        }, 2500);
        setTimeout(() => {
          this.setState({
            errorZipShow: false,
            errorZipFade: false
          });
        }, 3000);
      }, 600);

      return;
    }

    this.setState(
      {
        corgis: {},
        lastOffset: 0,
        totalResults: 0,
        showMore: false
      },
      () => {
        fetchJsonp(
          `http://api.petfinder.com/pet.find?format=json&key=APIKEYHERE&breed=Pembroke%20Welsh%20Corgi&animal=dog&location=${
            this.state.location
          }&count=500&callback=callback2`,
          {
            jsonpCallbackFunction: "callback2"
          }
        )
          .then(res => res.json())
          .then(data => this.totalResults(data.petfinder.lastOffset.$t))
          .catch(err => this.noResultsHandle(err));

        this.fetchMoreCorgis();
      }
    );
  };

  fetchMoreCorgis = () => {
    fetchJsonp(
      `http://api.petfinder.com/pet.find?format=json&key=APIKEYHERE&breed=Pembroke%20Welsh%20Corgi&animal=dog&location=${
        this.state.location
      }&count=5&offset=${this.state.lastOffset}&callback=callback`,
      {
        jsonpCallbackFunction: "callback"
      }
    )
      .then(res => res.json())
      .then(data => this.processCorgis(data.petfinder))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="main-container">
        <div id="cover" className="bg-warning d-flex">
          <div className="dark-overlay">
            <div className="container">
              <div className="row">
                <div className="col-sm-5 col-4 text-white">
                  <h1 className="mt-md-4 mt-2 mt-sm-5 ml-lg-3">
                    Adopt A Corgi Near You
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Form
          fetchCorgis={this.fetchCorgis}
          handleZipInput={this.handleZipInput}
          errorZipShow={this.state.errorZipShow}
          errorZipFade={this.state.errorZipFade}
          errorResultsShow={this.state.errorResultsShow}
          errorResultsFade={this.state.errorResultsFade}
        />
        {Object.keys(this.state.corgis).map(key => {
          return (
            <Corgi
              key={key}
              index={key}
              details={this.state.corgis[key]}
              handleOptionConversion={this.handleOptionConversion}
            />
          );
        })}
        <ShowMore
          fetchMoreCorgis={this.fetchMoreCorgis}
          showMore={this.state.showMore}
        />
      </div>
    );
  }
}

export default App;
