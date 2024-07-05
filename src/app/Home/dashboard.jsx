"use client"
import { useState, useEffect } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { UploadFileOutlined } from "@mui/icons-material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { colors } from "../../theme";
import Select from 'react-select'
import { formatDate } from "../../utils/parseDate";
import UploadCsvModal from "../upload-csv/UploadCsvModal";

const Dashboard = () => {
    const [equipments, setEquipments] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState('EQ-0010');
    const [timeFrame, setTimeFrame] = useState('1m');
    const [averageMeasurement, setAverageMeasurement] = useState(0);
    const [dataChart, setDataChart] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);

    const handleClickOpen = () => {
        setModalOpen(true);
    };

    const handleClose = () => {
        console.log('close');   
        setModalOpen(false);
    };

    const handleFileUpload = (file) => {
        console.log(file); 
    };
    console.log({modalOpen});

    const dot = (color = 'transparent') => ({
        alignItems: 'center',
        display: 'flex',    
        color: colors.greenAccent[300],
    
    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        display: 'block',
        marginRight: 20,
    },
    });

    const colourStyles = {
        control: (styles) => ({ ...styles, backgroundColor: '' }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
        ...styles,
        color: 'black',

        cursor: isDisabled ? 'not-allowed' : 'default',
    
        ':active': {
            ...styles[':active'],
            
        },
        };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot('') }),
    singleValue: (styles, ) => ({ ...styles, ...dot('') }),
    };

    useEffect(() => {
        const fetchEquipments = async () => {
        const response = await fetch('http://localhost:3005/api/sensor-data');
        const data = await response.json();
        const equipmentOptions = data.map(equipment => ({
            value: equipment.id,
            label: equipment.id
        }));
        setEquipments(equipmentOptions);
        };

        fetchEquipments();
    }, []);

    useEffect(() => {
        if(!selectedEquipment) return;
        const fetchSensorData = async () => {
        const response = await fetch(`http://localhost:3005/api/sensor-average?timeframe=${timeFrame}&sensor=${selectedEquipment}`);
        console.log({response});
        const data = await response.json();
        setDataChart(data);
        
        const average = data.reduce((acc, curr) => acc + curr.value, 0) / data.length;
        setAverageMeasurement(average);    
        };

        fetchSensorData();

    }, [selectedEquipment, timeFrame]);
    

    return (
        <Box ml="20px" p="20px">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

            <Box>
                <Button
                    onClick={handleClickOpen}
                    sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    }}
                >
                    <UploadFileOutlined sx={{ mr: "10px" }} />
                    Upload CSV`s
                </Button>
            </Box>
        </Box>
        {modalOpen && <UploadCsvModal  onClose={handleClose} onFileUpload={handleFileUpload} />}
        <Box mb="20px" width="350px" >
            <Select 
                options={equipments}
                noOptionsMessage={() => "...carregando"}                
                placeholder={selectedEquipment}
                styles={colourStyles}
                onChange={(option) => setSelectedEquipment(option.value)}
            />          
        </Box>
        <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
        >
            
            {/* ROW 1 */}
            <Box
            gridColumn="span 8"
            gridRow="span 3"
            backgroundColor={colors.primary[400]}
            >
            <Box
                mt="25px"
                p="0 30px"
                display="flex "
                justifyContent="space-between"
                alignItems="center"
            >
                <Box>
                <Typography
                    variant="h6"
                    fontWeight="600"
                    color={colors.grey[100]}
                >
                    Valor Medio
                </Typography>
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={colors.greenAccent[500]}
                >
                    {averageMeasurement.toFixed(2)}
                </Typography>
                </Box>
                <Box>
                <IconButton>
                    <DownloadOutlinedIcon
                    sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                    />
                </IconButton>
                </Box>
            </Box>
            <Box height="250px" m="-20px 0 0 0">
                {dataChart.length > 0 && <LineChart isDashboard={true} sensor={selectedEquipment} dataChart={dataChart}/> }
            </Box>
            </Box>
            <Box
            gridColumn="span 4"
            gridRow="span 3"
            backgroundColor={colors.primary[400]}
            overflow="auto"
            >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                colors={colors.grey[100]}
                p="15px"
            >
                <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                Ultimas Mediçõess
                </Typography>
            </Box>
            {dataChart.map((measurement, i) => (
                <Box
                key={`${measurement.id}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
                >
                <Box>
                    <Typography
                    color={colors.greenAccent[500]}
                    variant="h5"
                    fontWeight="600"
                    >
                    {measurement.equipmentId}
                    </Typography>
                </Box>
                <Box color={colors.grey[100]}>{formatDate(measurement.timestamp)}</Box>
                <Box
                    backgroundColor={colors.greenAccent[500]}
                    p="5px 10px"
                    borderRadius="4px"
                >
                    {measurement.value.toFixed(2)}
                </Box>
                </Box>
            ))}
            </Box>
        </Box>
        </Box>
    );
};

export default Dashboard;
