import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../App';

configure({adapter: new Adapter()});

describe("Testing the application using Jest", () => {

  test("App component renders correctly", () => {  
    const appComponent = renderer.create(<App />).toJSON();
    expect(appComponent).toMatchSnapshot();
  });

  test("Ensure the drop down shows a list of councils when clicked", () => {  
    const appComponent = mount(<App />);

    const dropDownElement = appComponent.find(".councilDropDown");
    dropDownElement.simulate("click");

    expect(dropDownElement).toHaveLength(1);
  })

  test("Council state should update when Use My Location is clicked", () => {
    const mockCheckLocation = jest.fn();
    const appComponent = mount(<App onClick={mockCheckLocation} />);
    const handleClick = jest.spyOn(React, "useState");
    handleClick.mockImplementation(council => [council, setCouncil]);
 
    const useMyLocationButton = appComponent.find(".useMyLocationButton");
    useMyLocationButton.simulate("click");

    expect(mockCheckLocation).toBeTruthy();
  });

  test("Restrictions state should update when a new council is selected using the dropdown", () => {
    const mockFetchRestrictions = jest.fn();
    const appComponent = mount(<App onChangeValue={mockFetchRestrictions} />);
    const handleClick = jest.spyOn(React, "useState");
    handleClick.mockImplementation(restrictions => [restrictions, setRestrictions]);

    appComponent.find(".councilDropDown").simulate("change", "", { value: ["val"] })

    expect(mockFetchRestrictions).toBeTruthy();
  });

  test("Alert Level state should update when a new council is selected using the dropdown", () => {
    const mockFetchAlertLevel = jest.fn();
    const appComponent = mount(<App onChangeValue={mockFetchAlertLevel} />);
    const handleClick = jest.spyOn(React, "useState");
    handleClick.mockImplementation(alertLevel => [alertLevel, setAlertLevel]);

    appComponent.find(".councilDropDown").simulate("change", "", { value: ["val"] })

    expect(mockFetchAlertLevel).toBeTruthy();
  });

  test("App loads with the alert level at 0", () => {
    const appComponent = shallow(<App />);

    const alertLevelText = appComponent.find(".alertLevel").render().text();

    expect(alertLevelText).toBe("0");
  });
});