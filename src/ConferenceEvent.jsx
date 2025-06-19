import React, { useState } from "react"; {/* to get useState */}
import "./ConferenceEvent.css"; {/* for css */}
import TotalCost from "./TotalCost"; {/* import TotalCost element */}
import { useSelector, useDispatch } from "react-redux"; {/* for redux to get application state and dispatch */}
import { incrementQuantity, decrementQuantity } from "./venueSlice"; {/* get slice specific reducers */}
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice"; {/* get slice specific reducers */}
import { toggleMealSelection } from "./mealsSlice"; {/* get slice specific reducers */}

const ConferenceEvent = () => {
    const [showItems, setShowItems] = useState(false); {/* to handle show item section */}
    const [numberOfPeople, setNumberOfPeople] = useState(1); {/* local componenet state to handle number of people */}
    const venueItems = useSelector((state) => state.venue); {/* get venue application state */}
    const avItems = useSelector((state) => state.av); {/* get AV application state */}
    const mealsItems = useSelector((state) => state.meals); {/* get meal application state */}
    const dispatch = useDispatch(); {/* to be used in dispatching reducers to slice */}
    const remainingAuditoriumQuantity = 3 - venueItems.find(item => 
      item.name === "Auditorium Hall (Capacity:200)").quantity;  {/* make sure this specific hall can have max 3 quantity */}

    
    const handleToggleItems = () => { {/* sent as prop to TotalCost Comonent */}
        console.log("handleToggleItems called");
        setShowItems(!showItems);
    };

    const handleAddToCart = (index) => { {/* local function to use dispatch to Venue slice */}
        if (venueItems[index].name === "Auditorium Hall (Capacity:200)" && venueItems[index].quantity >= 3) {
          return; 
        } else if (venueItems[index].quantity >= 10){
          return
        }
        dispatch(incrementQuantity(index)); {/* dispatch index action to Venue slice */}
      };
    
      const handleRemoveFromCart = (index) => { {/* local function to use dispatch to Venue slice */}
        if (venueItems[index].quantity > 0) {
          dispatch(decrementQuantity(index));  {/* dispatch index action to Venue slice */}
        }
      };



    const handleIncrementAvQuantity = (index) => { {/* local function to use dispatch to AV slice */}
      dispatch(incrementAvQuantity(index)); {/* dispatch index action to AV slice */}
    };

    const handleDecrementAvQuantity = (index) => {  {/* local function to use dispatch to AV slice */}
      dispatch(decrementAvQuantity(index)); {/* dispatch index action to AV slice */}
    };



    const handleMealSelection = (index) => { {/* local function to use dispatch to meal slice */}
      const item = mealsItems[index];
      if (item.selected && item.type === "mealForPeople") {
          // Ensure numberOfPeople is set before toggling selection
          const newNumberOfPeople = item.selected ? numberOfPeople : 0;
          dispatch(toggleMealSelection(index, newNumberOfPeople)); {/* dispatch index action to meal slice */}
      }
      else {
          dispatch(toggleMealSelection(index));
      }
       
    };

     {/* get each type of item using application state  */}
    const getItemsFromTotalCost = () => {
        const items = [];
            venueItems.forEach((item) => {
          if (item.quantity > 0) {
            items.push({ ...item, type: "venue" });
          }
        });
        avItems.forEach((item) => {
          if (
            item.quantity > 0 &&
            !items.some((i) => i.name === item.name && i.type === "av")
          ) {
            items.push({ ...item, type: "av" });
          }
        });
        mealsItems.forEach((item) => {
          if (item.selected) {
            const itemForDisplay = { ...item, type: "meals" };
            if (item.numberOfPeople) {
              itemForDisplay.numberOfPeople = numberOfPeople;
            }
            items.push(itemForDisplay);
          }
        });
        return items;
    };

     {/* local function to get items which is send as prop to ItemDiaplay component  */}
    const items = getItemsFromTotalCost();


    {/* component send as a function within the prop to TotalCost component  */}
    const ItemsDisplay = ({ items }) => {
      console.log(items);
        return <>
            <div className="display_box1">
                {items.length === 0 && <p>No items selected</p>}
                <table className="table_item_data">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Unit Cost</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>${item.cost}</td>
                                <td>
                                    {item.type === "meals" || item.numberOfPeople
                                    ? ` For ${numberOfPeople} people`
                                    : item.quantity}
                                </td>
                                <td>{item.type === "meals" || item.numberOfPeople
                                    ? `${item.cost * numberOfPeople}`
                                    : `${item.cost * item.quantity}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>

    };
    const calculateTotalCost = (section) => { {/* single function to handle 3 section cost  */}
        let totalCost = 0;
        if (section === "venue") {
          venueItems.forEach((item) => {
            totalCost += item.cost * item.quantity;
          });
        } else if (section === "av") {
          avItems.forEach((item) => {
            totalCost += item.cost * item.quantity;
          });
        } else if (section === "meals") {
            mealsItems.forEach((item) => {
                if (item.selected) {
                  totalCost += item.cost * numberOfPeople;
                }
              });
        }
            return totalCost;
      };
    const venueTotalCost = calculateTotalCost("venue"); {/* get section specific cost  */}
    const avTotalCost = calculateTotalCost("av");
    const mealsTotalCost = calculateTotalCost("meals");


    const navigateToProducts = (idType) => {  {/* to navigate to specific anchor */}
        if (idType == '#venue' || idType == '#addons' || idType == '#meals') {
          if (showItems) { // Check if showItems is false
            setShowItems(!showItems); // Toggle showItems to true only if it's currently false
          }
        }
      }
    {/* totacost object to store all section costs sent as prop to TotalCost Component */}  
    const totalCosts = {
      venue: venueTotalCost,
      av: avTotalCost,
      meals: mealsTotalCost,
    };


    return (
        <>
            <navbar className="navbar_event_conference">
                <div className="company_logo">Conference Expense Planner</div>
                <div className="left_navbar">
                    <div className="nav_links">
                      {/* to navigate to specific anchor */}
                        <a href="#venue" onClick={() => navigateToProducts("#venue")} >Venue</a>
                        <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
                        <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
                    </div>
                     {/* button to showitem  section */}
                    <button className="details_button" onClick={() => setShowItems(!showItems)}>
                        Show Details
                    </button>
                </div>
            </navbar>
            <div className="main_container">
              {/* if not showitem ? dipaly listing : TotalCost component */}
                {!showItems
                    ?
                    (
                        <div className="items-information">
                            <div id="venue" className="venue_container container_main">
                              <div className="text">
                                <h1>Venue Room Selection</h1>
                              </div>
                            <div className="venue_selection">
                              {venueItems.map((item, index) => (
                                <div className="venue_main" key={index}>
                                  <div className="img">
                                    <img src={item.img} alt={item.name} />
                                  </div>
                                  <div className="text">{item.name}</div>
                                  <div>${item.cost}</div>
                        <div className="button_container">
                                {/* if Auditorium hall ? handle 3 max qunatity : other halls */}
                            {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (

                              <>
                              <button
                                className={venueItems[index].quantity === 0 ? "btn-warning btn-disabled" : "btn-minus btn-warning"}
                                onClick={() => handleRemoveFromCart(index)}
                              >
                                &#8211;
                              </button>
                              <span className="selected_count">
                                {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
                              </span>
                              <button
                                className={remainingAuditoriumQuantity === 0? "btn-success btn-disabled" : "btn-success btn-plus"}
                                onClick={() => handleAddToCart(index)}
                              >
                                &#43;
                              </button>
                            </>
                            ) : (
                              <div className="button_container">
                              <button
                                  className={venueItems[index].quantity ===0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
                                  onClick={() => handleRemoveFromCart(index)}
                                >
                                  &#8211;
                                </button>
                                <span className="selected_count">
                                  {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
                                </span>
                                <button
                                  className={venueItems[index].quantity === 10 ? " btn-success btn-disabled" : "btn-success btn-plus"}
                                  onClick={() => handleAddToCart(index)}
                                >
                                &#43;
                                </button>
                                
                                
                              </div>
                            )}
                          </div>
                                </div>
                              ))}
                            </div>
                            <div className="total_cost">Total Cost: ${venueTotalCost}</div>
                          </div>

                            {/*Necessary Add-ons*/}
                            <div id="addons" className="venue_container container_main">


                                <div className="text">

                                    <h1> Add-ons Selection</h1>

                                </div>
                                <div className="addons_selection">
                                  {avItems.map((item, index) => (
                                      <div className="av_data venue_main" key={index}>
                                          <div className="img">
                                              <img src={item.img} alt={item.name} />
                                          </div>
                                      <div className="text"> {item.name} </div>
                                      <div> ${item.cost} </div>
                                          <div className="addons_btn">
                                              <button className="btn-warning" onClick={() => handleDecrementAvQuantity(index)}> &ndash; </button>
                                              <span className="quantity-value">{item.quantity}</span>
                                              <button className=" btn-success" onClick={() => handleIncrementAvQuantity(index)}> &#43; </button>
                                          </div>
                                      </div>
                                  ))}

                                </div>
                                <div className="total_cost">Total Cost:{avTotalCost}</div>

                            </div>

                            {/* Meal Section */}

                            <div id="meals" className="venue_container container_main">

                                <div className="text">

                                    <h1>Meals Selection</h1>
                                </div>

                                <div className="input-container venue_selection">
                                  <label htmlFor="numberOfPeople"><h3>Number of People:</h3></label>
                                  <input type="number" className="input_box5" id="numberOfPeople" value={numberOfPeople}
                                      onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                                      min="1"
                                  />

                                </div>
                                <div className="meal_selection">
                                  {mealsItems.map((item, index) => (
                                    <div className="meal_item" key={index} style={{ padding: 15 }}>
                                        <div className="inner">
                                            <input type="checkbox" id={ `meal_${index}` }
                                                checked={ item.selected }
                                                onChange={() => handleMealSelection(index)}
                                            />
                                            <label htmlFor={`meal_${index}`}> {item.name} </label>
                                        </div>
                                        <div className="meal_cost">${item.cost}</div>
                                    </div>
                                ))}

                                </div>
                                <div className="total_cost">Total Cost: {mealsTotalCost}</div>


                            </div>
                        </div>
                    ) : (
                        <div className="total_amount_detail">
                            <TotalCost totalCosts={totalCosts} handleClick={handleToggleItems} ItemsDisplay={() => <ItemsDisplay items={items} />} />
                        </div>
                    )
                }




            </div>
        </>

    );
};

export default ConferenceEvent;
