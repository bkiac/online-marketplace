import StateEnum from '../../util/StateEnum';

switch (product.state) {
  case StateEnum.Purchased: {
    return (
      <ProductForSale
        product={product}
        handleShipping={this.handleShipping}
      />
    );
  }
  case StateEnum.Shipped: {
    return (
      <ProductForSale
        product={product}
      />
    );
  }
  case StateEnum.Received: {
    return (
      <ProductForSale
        product={product}
      />
    );
  }
  default: {
    return (<div />);
  }
}