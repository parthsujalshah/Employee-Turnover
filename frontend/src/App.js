import 'antd/dist/antd.css';
import {
  Form,
  Checkbox,
  Select,
  Input,
  Button,
  Slider,
  Card,
  Modal,
  Spin,
  PageHeader,
  Affix,
  Alert
} from 'antd';
import React from 'react';
import axios from "axios";
import { apiUrl } from "./constants";
import Lottie from 'react-lottie';
import * as animationDataLeaving from './employee-leaving.json';
import * as animationDataStaying from './employee-staying.json';


const { Option } = Select;

function App() {

  const [isStopped, setIsStopped] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [staying, setStaying] = React.useState(false);
  const [modalLoading, setModalLoading] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [timeCompanyAlert, setTimeCompanyAlert] = React.useState(false);
  const [floatAlert, setFloatAlert] = React.useState(false);

  const defaultOptionsLeaving = {
    loop: false,
    autoplay: true,
    animationData: animationDataLeaving.default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  const defaultOptionsStaying = {
    loop: false,
    autoplay: true,
    animationData: animationDataStaying.default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const onFinish = (values) => {
    if (values.satisfaction_level === undefined) {
      values.satisfaction_level = 0;
    }
    if (values.Work_accident === undefined) {
      values.Work_accident = false;
    }
    if (values.promotion_last_5years === undefined) {
      values.promotion_last_5years = false;
    }
    values.satisfaction_level /= 100;
    if (parseFloat(values.last_evaluation) > parseFloat(values.time_spend_company)) {
      setTimeCompanyAlert(true);
    } else if (
      values.last_evaluation != parseFloat(values.last_evaluation)
      ||
      values.time_spend_company != parseFloat(values.time_spend_company)
    ) {
      setFloatAlert(true);
    } else {
      setTimeCompanyAlert(false);
      setFloatAlert(false);
      console.log(values);
      showModal();
      setModalLoading(true);
      axios.post(apiUrl, values).then(res => {
        console.log(res.data);
        setStaying(res.data.staying);
        setModalLoading(false);
      }).catch(err => console.log(err));
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Affix>
        <Card style={{ backgroundColor: "#e6fffb" }}>
          <PageHeader
            // className="site-page-header"
            // onBack={() => null}
            title="Employee Turnover Predictor"
            subTitle="Predict wether the employee will continue in your company or not"
          />
        </Card>
      </Affix>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          {
            modalLoading ?
              <Spin size="large" />
              :
              <div>
                {
                  staying ?
                    <div>
                      <Lottie height={"400"} width={"400"} options={defaultOptionsStaying} isStopped={isStopped} isPaused={isPaused} />
                      <h2>Employee is Staying</h2>
                    </div>
                    :
                    <div>
                      <Lottie height={"400"} width={"400"} options={defaultOptionsLeaving} isStopped={isStopped} isPaused={isPaused} />
                      <h2>Employee is Leaving</h2>
                    </div>
                }
              </div>
          }
        </Modal>
        <Card style={{ backgroundColor: "#fafafa" }}>
          {
            timeCompanyAlert ?
              <Alert
                message="Error"
                description="The 'Time Since Last Evaluation' cannot be greater than the 'Time spent at the company'."
                type="error"
                showIcon
              />
              :
              <div />
          }
          {
            floatAlert ?
              <Alert
                message="Error"
                description="Both the written fields should be floating point numbers."
                type="error"
                showIcon
              />
              :
              <div />
          }
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >

            <Form.Item name="satisfaction_level" label="Employee Statisfaction Percent">
              <Slider
                marks={{
                  0: '0',
                  20: '20',
                  40: '40',
                  60: '60',
                  80: '80',
                  100: '100',
                }}
              />
            </Form.Item>

            <Form.Item
              label="Time Since Last Evaluation (in years)"
              name="last_evaluation"
              rules={[
                {
                  required: true,
                  message: 'This field is Required!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Time Spent at Company (in years)"
              name="time_spend_company"
              rules={[
                {
                  required: true,
                  message: 'This field is Required!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="department"
              label="Department"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select the Department of the Employee"
                allowClear
              >
                <Option value="RandD">R and D</Option>
                <Option value="hr">HR</Option>
                <Option value="management">Management</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="salary"
              label="Salary"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select the Salary Slab of the Employee"
                allowClear
              >
                <Option value="salary_high">High</Option>
                <Option value="salary_low">Low</Option>
              </Select>
            </Form.Item>

            <Form.Item name="Work_accident" valuePropName="checked">
              <Checkbox>Employee Been in a Work Accident</Checkbox>
            </Form.Item>

            <Form.Item name="promotion_last_5years" valuePropName="checked">
              <Checkbox>Employee Promoted in the last 5 Years</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default App;
