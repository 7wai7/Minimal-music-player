import Header from "../components/Header";
import PageBackground from "../components/PageBackground";

function Page({ children }: { children?: React.ReactNode }) {
    return (
        <div className="page">
            <PageBackground />
            <Header />
            <div className="page-content">
                {children}
            </div>
        </div>
    );
}

export default Page;
