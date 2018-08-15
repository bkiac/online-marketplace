import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

const Navigation = ({ isOpen, toggle, account, isOwner }) => (
  <div>
    <Navbar color="light" light expand="md">
      <NavbarBrand>Current account: {account} {isOwner ? '(Owner)' : ''}</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav inNavbar hidden={!isOwner}>
            <DropdownToggle nav caret>
              Admin
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem href="/admin/contract-settings">
                Contract settings
              </DropdownItem>
              <DropdownItem href="/admin/product-disputes">
                Product disputes
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
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
