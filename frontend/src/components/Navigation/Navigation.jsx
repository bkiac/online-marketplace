import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

const Navigation = (props) => {
  const { isOpen, toggle, account } = props;

  return (
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
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};


export default Navigation;
