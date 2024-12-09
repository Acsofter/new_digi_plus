import { Modal } from "../components/Modal";
import { Table } from "../components/Table";
import { MetricsHome } from "../components/MetricsHome";

export const Home = () => {
  return (
    <div className="relative flex h-full w-full">
      {/* <Modal /> */}
      <div className="content w-full gap-3 rounded-2xl overflow-hidden bg-[#fefefe] dark:bg-transparent p-2 m-3 h-screen">
        <MetricsHome />
        <Table />
      </div>
    </div>
  );
};
