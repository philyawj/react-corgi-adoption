import React, { Component } from "react";
import "./App.css";
import Form from "./Components/Form";
import PetList from "./Components/PetList";
import uuid from "uuid";
import _ from "lodash";
import ShowMore from "./Components/ShowMore";
import fetchJsonp from "fetch-jsonp";

class App extends Component {
  state = {
    pets: {
      // pet6: {
      //   name: "Buddy"
      // },
      // pet7: {
      //   name: "Sparky"
      // }
    },
    batchedPets: {},
    batchNum: 5
  };

  componentDidMount() {
    // console.log(Object.keys(this.state.pets));
    // console.log(this.state.pets);
  }

  componentDidUpdate() {
    // console.log(Object.keys(this.state.pets)[0]);
    // console.log(this.state.batchNum);
  }

  resetState = () => {
    this.setState({
      pets: {},
      batchNum: 0
    });
  };

  handleOptionConversion = option => {
    if (option === "altered") {
      return (
        <div>
          <i className="fas fa-check text-primary" /> Spayed/Neutered
        </div>
      );
    } else if (option === "noDogs") {
      return (
        <div>
          <i className="fas fa-times text-primary" /> &nbsp;No Dogs
        </div>
      );
    } else if (option === "noCats") {
      return (
        <div>
          <i className="fas fa-times text-primary" /> &nbsp;No Cats
        </div>
      );
    } else if (option === "housetrained") {
      return (
        <div>
          <i className="fas fa-check text-primary" /> Housebroken
        </div>
      );
    } else if (option === "noKids") {
      return (
        <div>
          <i className="fas fa-times text-primary" /> &nbsp;No Kids
        </div>
      );
    } else if (option === "specialNeeds") {
      return (
        <div>
          <i className="fas fa-wheelchair text-primary" /> Special Needs
        </div>
      );
    } else if (option === "hasShots") {
      return (
        <div>
          <i className="fas fa-check text-primary" /> Has Shots
        </div>
      );
    }
  };

  handleAddBatch = () => {
    // console.log(this.state.batchNum);
    // this.setState({
    //   batchNum: this.state.batchNum + 1
    // });
    // this.setState((prevState, props) => {
    //   return { batchNum: prevState.batchNum + 1 };
    // });
    // let batch = { ...this.state.pets };
    // let test = batch[this.state.batchNum];
    // console.log(batch);
    // console.log(test);
    console.log(this.state.batchNum);

    // this.setState({ batchNum: this.state.batchNum + 5 }, () =>
    //   fetchJsonp(
    //     `http://api.petfinder.com/pet.find?format=json&key=2a7d3a2ebefc1c6abf49abf2f311555a&breed=Welsh%20Corgi&animal=dog&location=${
    //       this.state.location
    //     }&count=5&offset=5&callback=callback`,
    //     {
    //       jsonpCallbackFunction: "callback"
    //     }
    //   )
    //     .then(res => res.json())
    //     .then(data => console.log(data.petfinder.pets.pet))
    //     .catch(err => console.log(err))
    // );

    fetchJsonp(
      `http://api.petfinder.com/pet.find?format=json&key=2a7d3a2ebefc1c6abf49abf2f311555a&breed=Welsh%20Corgi&animal=dog&location=${
        this.state.location
      }&count=5&offset=5&callback=callback`,
      {
        jsonpCallbackFunction: "callback"
      }
    )
      .then(res => res.json())
      .then(data => console.log(data.petfinder.pets.pet))
      .catch(err => console.log(err));

    console.log(this.state.batchNum);
  };

  processPets = pets => {
    // process the pets here to make them each an individual object with a key
    // let number = 0;

    let petsObj = { ...this.state.pets };
    // makes a copy of state

    pets.forEach((pet, index) => {
      let calcBreed;
      if (pets[index].breeds.breed.$t) {
        calcBreed = pets[index].breeds.breed.$t;
      } else if (pets[index].breeds.breed[0].$t !== "Welsh Corgi") {
        calcBreed = pets[index].breeds.breed[0].$t;
      } else if (pets[index].breeds.breed[1].$t !== "Welsh Corgi") {
        calcBreed = pets[index].breeds.breed[1].$t;
      }

      let calcOptions;
      let optionArray;

      if (_.isEmpty(pets[index].options.option)) {
        calcOptions = "EMPTY";
        // calcOptions equals empty array
      } else if (pets[index].options.option.$t) {
        calcOptions = this.handleOptionConversion(
          pets[index].options.option.$t
        );
        // console.log(calcOptions);
      } else {
        optionArray = _.mapValues(pets[index].options.option, "$t");
        // console.log(_.mapValues(pets[index].options.option, "$t"));
      }

      let calcPhoto;
      if (_.isEmpty(pets[index].media)) {
        calcPhoto = "./img/no-image.jpg";
      } else {
        calcPhoto = pets[index].media.photos.photo[3].$t;
      }

      let newPet = {
        name: pets[index].name.$t,
        sex: pets[index].sex.$t,
        age: pets[index].age.$t,
        photo: calcPhoto,
        city: pets[index].contact.city.$t,
        address: pets[index].contact.address1.$t,
        state: pets[index].contact.state.$t,
        zip: pets[index].contact.zip.$t,
        description: pets[index].description.$t,
        email: pets[index].contact.email.$t,
        phone: pets[index].contact.phone.$t,
        breed: calcBreed,
        option: calcOptions,
        options: optionArray
      };

      //loops through pets using the index

      petsObj[`pet${uuid()}`] = newPet;
      // petsObj[number] = newPet;

      // number = number + 1;
      // use bracket notation to assign keys to objects in object literals.
      // assigns them a unique key, with details inside that object
    });

    this.setState({
      pets: petsObj
    });

    // sets state with new pets
  };

  render() {
    return (
      <div>
        <h1 className="text-center mt-2 text-primary display-1 font-weight-light">
          Adopt A Corgi
        </h1>
        <Form processPets={this.processPets} resetState={this.resetState} />
        <div className="container">
          {Object.keys(this.state.pets).map(key => {
            return (
              <PetList
                key={key}
                index={key}
                details={this.state.pets[key]}
                options={this.state.pets[key].options}
                handleOptionConversion={this.handleOptionConversion}
              />
            );
          })}
          <ShowMore
            petsState={this.state.pets}
            handleAddBatch={this.handleAddBatch}
          />
        </div>
      </div>
    );
  }
}

export default App;

// {!_.isEmpty(this.state.batchedPets) ? (
//   <div className="container text-center">
//     <button
//       className="btn btn-primary btn-lg"
//       onClick={this.handleAddBatch}
//     >
//       Show More
//     </button>
//   </div>
// ) : (
//   ""
// )}
