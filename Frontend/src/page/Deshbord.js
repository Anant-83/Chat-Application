import React, { Fragment } from "react";
import Header from "../components/Header/Header";
import AddToRoomForm from "../components/Form/AddToRoomForm";
import Layout from "../components/Ui/Layout";
const Deshbord = () => {
  return (
    <Layout>
      <Header />
      <AddToRoomForm />
    </Layout>
  );
};

export default Deshbord;
