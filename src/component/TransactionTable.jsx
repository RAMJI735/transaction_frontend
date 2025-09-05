'use client'
import React, { useState, useEffect } from 'react'
import { 
  TableRow, 
  Table, 
  TableContainer, 
  TableHead, 
  TableCell, 
  TableSortLabel, 
  TableBody, 
  Typography, 
  Button, 
  FormControl, 
  Select, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  IconButton
} from '@mui/material'
import tableStyles from '../styles/table.module.css'
import { Pencil, Trash2, X } from 'lucide-react'
import { useTransactionContext } from '../services/context/contextstate'

const rowsPerPageOptions = [5, 10, 25, 50]

function TransactionTable() {
    const {addTransaction,getTransaction,updateTransaction,deleteTransaction}= useTransactionContext();

    const [transactions, setTransactions] = useState([])


    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Edit modal State
    const [Editopen, setEditOpen] = useState(false)
    const [isloading,setisLoading]= useState(false);
    const handleEditOpen = (row) => {
        setisLoading(true);
        setdata({
            id: row.id,
            description: row.description
        })
        setEditOpen(true)
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
        setdata({})
        setisLoading(false);
    }


    const [data,setdata]= useState([]);


    // Sorting state - default to newest first
    const [orderBy, setOrderBy] = useState('createdAt')
    const [order, setOrder] = useState('desc')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...transactions].sort((a, b) => {
        // For date fields, newest first by default
        if (orderBy === 'date' || orderBy === 'id') {
            if (order === 'desc') {
                return new Date(b[orderBy]) - new Date(a[orderBy])
            } else {
                return new Date(a[orderBy]) - new Date(b[orderBy])
            }
        }

        // For other fields
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1
        }
        return 0
    })

    // pagination
    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    // form error and submit
    const [formErrors, setFormErrors] = useState({})

    const validateFields = (data) => {
        let errors = {}
        if (!data.description) errors.description = 'Description is required'
        // if (!data.amount) errors.amount = 'Amount is required'
        return errors
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setdata(prev => ({
            ...prev,
            [name]: value
        }))
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }



    const handleSubmit = async () => {
        const errors = validateFields(data)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            alert('Please fill all required fields')
            return
        }

        try {
            const res= await addTransaction(data);
            alert(res.message)
            fetchTransaction();
            handleEditClose()
        } catch (error) {
            console.error(error)
        }
    }

    const fetchTransaction = async () => {
        const res = await getTransaction();
        setTransactions(res.data||[]);
    }
    useEffect(() => {
        fetchTransaction();
    }, []);



   const handleEditSubmit=()=>{
 const errors = validateFields(data)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            alert('Please fill all required fields')
            return
        }

        try {
            const res= updateTransaction(data);
            alert(res.message)
            fetchTransaction();
            handleEditClose()
        } catch (error) {
            console.error(error)
        }

    }


    const handleDelete =(id)=>{
        try {
            const res= deleteTransaction(id);
            alert(res.message)
            fetchTransaction();
            handleEditClose()
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            <Dialog
                onClose={handleEditClose}
                aria-labelledby='customized-dialog-title'
                open={Editopen}
                fullWidth
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                   {isloading ? 'Edit Transaction' : ' Add Transaction'}
                    </Typography>
                    <IconButton
                        onClick={handleEditClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <X />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        <div className='m-2'>
                            <TextField
                                className='w-full'
                                name='description'
                                label='Description'
                                onChange={handleInputChange}
                                value={data.description||''}
                                multiline
                                rows={1}
                                variant='outlined'
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                            />
                        </div>
                       
                    </Typography>
                </DialogContent>
                <DialogActions>
                    {isloading  ? (
                    <Button onClick={handleEditSubmit} variant='contained'>
                         Edit 
                    </Button>):(
                        <Button onClick={handleSubmit} variant='contained'>
                            Add
                        </Button>
                    ) }
                     
                    
                    <Button onClick={handleEditClose} variant='outlined' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* table */}
            <TableContainer className='shadow p-6' >
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Transactions</h3>
                    <div className='flex items-center gap-2 mx-4'>
                        <Typography variant='body2'>Rows per page:</Typography>
                        <FormControl size='small' variant='standard'>
                            <Select
                                value={rowsPerPage}
                                className='mx-2 w-16'
                                onChange={handleChangeRowsPerPage}
                                label='Rows per page'
                            >
                                {rowsPerPageOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant='contained' onClick={() => {
                            setEditOpen(true)
                        }}>Add Transaction</Button>
                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'id'}
                                    direction={orderBy === 'id' ? order : 'desc'}
                                    onClick={() => handleRequestSort('id')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'description'}
                                    direction={orderBy === 'description' ? order : 'desc'}
                                    onClick={() => handleRequestSort('description')}
                                >
                                    Description
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'amount'}
                                    direction={orderBy === 'amount' ? order : 'desc'}
                                    onClick={() => handleRequestSort('amount')}
                                >
                                    Amount
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'date'}
                                    direction={orderBy === 'date' ? order : 'desc'}
                                    onClick={() => handleRequestSort('date')}
                                >
                                    Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{row?.id}</div>
                                </TableCell>
                                <TableCell className='p-2'>{row?.description}</TableCell>
                                <TableCell className='p-2'>${row?.amount}</TableCell>
                                <TableCell className='p-2'>${row?.category}</TableCell>
                                <TableCell className='p-2'>{new Date(row?.createdAt).toLocaleString("en-US", { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</TableCell>
                                <TableCell className='p-2'>
                                    <Pencil
                                        onClick={() => handleEditOpen(row)}
                                        className='text-blue-500 mx-4 size-5 cursor-pointer hover:scale-110 transition'
                                    />
                                    <Trash2
                                        onClick={() => handleDelete(row?._id)}
                                        className='text-red-500 mx-4 size-5 cursor-pointer hover:scale-110 transition'
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default TransactionTable
