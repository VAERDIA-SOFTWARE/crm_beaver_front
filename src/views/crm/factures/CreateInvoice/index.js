import React, { useEffect, useState } from 'react';

// material-ui
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/lab';

// project imports
import AddItemPage from './AddItemPage';
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';

// third-party
import * as yup from 'yup';
import ProductsPage from './ProductsPage';
import TotalCard from './TotalCard';
import { useFormik } from 'formik';
import CreateForm from '../forms/CreateForm';

// yup validation-schema
const validationSchema = yup.object({
  invoiceNumber: yup.string().required('Invoice Number is Required'),
  customerName: yup.string().required('Customer Name is Required'),
  customerEmail: yup.string().email('Enter a valid email').required('Customer Email is Required'),
  customerPhone: yup.string().min(10, 'Phone number should be of minimum 10 characters').required('Customer Phone is Required'),
  customerAddress: yup.string().required('Customer Address is Required'),
  orderStatus: yup.string().required('Order Status is required')
});

// ==============================|| CREATE INVOICE ||============================== //

function CreateInvoice() {
  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      invoiceNumber: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      orderStatus: 'pending'
    },
    validationSchema,
    onSubmit: (values) => {
      if (values) {
        setOpen(true);
      }
    }
  });

  // array of products
  const initialProducsData = [
    {
      id: 1,
      product: 'Logo Design',
      description: 'lorem ipsum dolor sit amat, connecter adieu siccing eliot',
      quantity: 6,
      amount: 200.0,
      total: 1200.0
    },
    {
      id: 2,
      product: 'Landing Page',
      description: 'lorem ipsum dolor sit amat, connecter adieu siccing eliot',
      quantity: 7,
      amount: 100.0,
      total: 700.0
    },
    {
      id: 3,
      product: 'Admin Template',
      description: 'lorem ipsum dolor sit amat, connecter adieu siccing eliot',
      quantity: 5,
      amount: 150.0,
      total: 750.0
    }
  ];

  const [allAmounts, setAllAmounts] = useState({
    subTotal: 0,
    appliedTaxValue: 0.1,
    appliedDiscountValue: 0.05,
    taxesAmount: 0,
    discountAmount: 0,
    totalAmount: 0
  });

  const [productsData, setProductsData] = useState(initialProducsData);
  const [valueBasic, setValueBasic] = React.useState(new Date());
  const [addItemClicked, setAddItemClicked] = useState(false);

  // for calculating cost of all orders
  const getTotalAmounts = () => {
    const amounts = {
      subTotal: 0,
      appliedTaxValue: 0.1,
      appliedDiscountValue: 0.05,
      taxesAmount: 0,
      discountAmount: 0,
      totalAmount: 0
    };
    productsData.forEach((item) => {
      amounts.subTotal += item.total;
    });
    amounts.taxesAmount = amounts.subTotal * amounts.appliedTaxValue;
    amounts.discountAmount = (amounts.subTotal + amounts.taxesAmount) * amounts.appliedDiscountValue;
    amounts.totalAmount = amounts.subTotal + amounts.taxesAmount - amounts.discountAmount;
    setAllAmounts(amounts);
  };

  // calculates costs when order-details change
  useEffect(() => {
    getTotalAmounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsData]);

  // to delete row in order details
  const deleteProductHandler = (id) => {
    setProductsData(productsData.filter((item) => item.id !== id));
  };

  // Dialog Handler
  const handleDialogOk = () => {
    setOpen(false);
    formik.resetForm();
  };

  // add item handler
  const handleAddItem = (addingData) => {
    setProductsData([
      ...productsData,
      {
        id: addingData.id,
        product: addingData.name,
        description: addingData.desc,
        quantity: addingData.selectedQuantity,
        amount: addingData.amount,
        total: addingData.totalAmount
      }
    ]);

    setAddItemClicked(false);
  };

  return <CreateForm />;
}

export default CreateInvoice;
