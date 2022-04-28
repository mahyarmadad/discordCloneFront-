import FriendsList from "@Components/Dashboard/FriendsList";
import Messenger from "@Components/Dashboard/Messenger";
import Sidebar from "@Components/Dashboard/Sidebar";
import Layout from "@Screen/Layout";
import styles from "./dashboard.module.scss";

export default function Dashboard() {
  return (
    <Layout className={styles.container}>
      <Sidebar />
      <FriendsList />
      <Messenger />
    </Layout>
  );
}