import { useState, useEffect, useContext } from "react";
import { Table, Card, Typography, message } from "antd";
import applicationService from "../../services/applicationService";
import { LoginContext } from "../ContextProvider/LoginContext";

const { Title } = Typography;

const Applicants = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(false);
    const { loginData } = useContext(LoginContext);
    const [messageApi, contextHolder] = message.useMessage(); // Ant Design message API

    useEffect(() => {
        const fetchApplicants = async () => {
            setLoading(true);
            const key = "loading"; // Unique key for updating the message

            // Show loading message
            messageApi.open({ key, type: "loading", content: "Loading applicants data..." });

            try {
                const response = await applicationService.getApplicantsForEmployer(loginData?.user?.id);
                const apiResponseData = response?.applicants || [];
                setApplicants(apiResponseData);
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (apiResponseData.length == 0) {
                    messageApi.open({ key, type: "error", content: "No Jobs are posted or No Applications Found", duration: 2.5 });
                } else {
                    // Show success message
                    messageApi.open({ key, type: "success", content: "Applicants data loaded successfully!", duration: 2.5 });
                }
            } catch (error) {
                // Show error message
                messageApi.open({ key, type: "error", content: "Failed to load applicants data.", duration: 2.5 });
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [loginData]); // Fetch when `loginData` changes

    const columns = [
        {
            title: "First Name",
            dataIndex: "firstName",
            key: "firstName",
            render: (text) => text || "N/A",
        },
        {
            title: "Last Name",
            dataIndex: "lastName",
            key: "lastName",
            render: (text) => text || "N/A",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (text) => text || "N/A",
        },
        {
            title: "Jobs Applied",
            dataIndex: "noOfJobs",
            key: "noOfJobs",
            render: (num) => num ?? 0, // Show 0 if undefined
        },
    ];

    return (
        <div className="container mx-auto p-6">
            {contextHolder} {/* Required for Ant Design messages */}
            <Title level={2}>Applicants List</Title>

            <Card className="mt-4 shadow-md">
                <Table dataSource={applicants} columns={columns} rowKey="userId" loading={loading} />
            </Card>
        </div>
    );
};

export default Applicants;
