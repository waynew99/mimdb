import CustomHead from "../../components/CustomHead";
import Header from "../../components/Header";
import Introduction from "../../components/Introduction";
import styles from "../../styles/Home.module.css";
import Layout from "../../components/Layouts/Layout";

export default function SubmitPage() {

  return (
    <div className={styles.container}>
      <Layout>
        <Introduction />
      </Layout>
    </div>
  );
}