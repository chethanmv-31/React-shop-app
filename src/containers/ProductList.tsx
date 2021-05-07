import React from "react";
import Column from "../components/Column";
import Product from "../components/Product";
import Row from "../components/Row";
import ProductService from "../services/ProductService";
import { ProductType, StoreType } from "../types";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import CartActions from "../store/actions/CartActions";
import Paginate from "../components/Paginate";
import loadingReducer from "../store/reducers/LoadingReducer";
import LoadingWrapper from "../components/LoadingWrapper";
import LoadingActions from "../store/actions/LoadingActions";

type Props = {
  selectedCurrency: string;
  addItem: (product: ProductType) => void;
  showLoader:()=>void;
  hideLoader:()=>void;
} & RouteComponentProps;
type State = { plist: ProductType[]; totalPages: number; pageNumber: number };
class ProductList extends React.Component<Props, State> {
  state: State = { plist: [], totalPages: 0, pageNumber: 1 };
  componentDidMount() {
    this.getData();
  }
  async getData() {
    try {
      const { data } = await ProductService.getProducts(this.state.pageNumber);
      this.props.showLoader();
      this.setState({
        plist: data.data,
        totalPages: data.totalPages,
        pageNumber: data.currentPage,
      });
      this.props.hideLoader();
      // console.log("success", data);
    } catch (e) {
      console.log("error", e);
      this.props.hideLoader();
    }
  }
  addToCart(product: ProductType) {
    this.props.addItem(product); // add to cart logic
    this.props.history.push("/cart"); // redirect to cart page
  }
  updateData = (page: number) =>
    this.setState({ pageNumber: page }, () => this.getData());
  render() {
    return (
      <LoadingWrapper>  
      <Row>
        {this.state.plist.map((val) => (
          <Column size={3} classes={"my-3"}>
            <Product
              btnClick={() => this.addToCart(val)}
              pdata={val}
              key={val.productId}
              currencyCode={this.props.selectedCurrency}
            />
          </Column>
        ))}
        <Column size={12} classes={"text-center"}>
          <Paginate
            totalPages={this.state.totalPages}
            currentPage={this.state.pageNumber}
            changePage={this.updateData}
          />
        </Column>
      </Row>
      </LoadingWrapper>
    );
  }
}
// connect(how to connect)(what to connect/component)
// store data can be accessed thru the props of the component
const mapStoreToProps = (store: StoreType) => {
  return {
    selectedCurrency: store.currency, // undefined => INR => USD
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    addItem: (p: ProductType) => dispatch(CartActions.addToCart(p)),
    hideLoader:() => dispatch(LoadingActions.hideLoader()),
    showLoader: ()=>dispatch(LoadingActions.showLoader()),
  };
};
export default connect(mapStoreToProps, mapDispatchToProps)(ProductList);
