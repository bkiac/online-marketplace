import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

const Navigation = ({ isOpen, toggle, account }) => (
  <div>
    <Navbar color="light" light expand="md">
      <NavbarBrand>Current account: {account}</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href="/buy">Buy</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/sell">Sell</NavLink>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              My Products
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem href="/my-products-for-sale">
                For sale
              </DropdownItem>
              <DropdownItem href="/my-purchased-products">
                Purchased
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  </div>
);


export default Navigation;
