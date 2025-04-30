import { useState, useEffect } from 'react';
import { Plus, DollarSign, Search, Download, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../ui/Button';
import { Invoice } from '../../types/billing';

const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoices');
    return saved
      ? JSON.parse(saved)
      : [
          { id: '1', patientName: 'John Doe', amount: 150.0, date: '2025-04-28', status: 'Paid' },
          { id: '2', patientName: 'Jane Smith', amount: 200.0, date: '2025-04-29', status: 'Pending' },
        ];
  });
  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, 'id'>>({
    patientName: '',
    amount: 0,
    date: '',
    status: 'Pending',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `${invoices.length + 1}`;
    setInvoices([...invoices, { ...newInvoice, id: newId }]);
    setNewInvoice({ patientName: '', amount: 0, date: '', status: 'Pending' });
    toast.success('Invoice added successfully!');
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter((i) => i.id !== id));
    toast.success('Invoice deleted successfully!');
  };

  const handleExport = () => {
    const csv = [
      'ID,Patient Name,Amount,Date,Status',
      ...invoices.map((i) => `${i.id},"${i.patientName}",${i.amount},${i.date},${i.status}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoices.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Invoices exported successfully!');
  };

  const filteredInvoices = invoices.filter((i) =>
    i.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Billing Management</h2>
      <form onSubmit={handleAddInvoice} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Patient Name</label>
          <input
            type="text"
            value={newInvoice.patientName}
            onChange={(e) => setNewInvoice({ ...newInvoice, patientName: e.target.value })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={newInvoice.amount}
            onChange={(e) => setNewInvoice({ ...newInvoice, amount: parseFloat(e.target.value) })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={newInvoice.date}
            onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={newInvoice.status}
            onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value as 'Paid' | 'Pending' | 'Overdue' })}
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" className="w-full sm:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            Add Invoice
          </Button>
        </div>
      </form>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Invoice List</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search invoices..."
                className="pl-9 w-64 rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
              />
            </div>
            <Button onClick={handleExport} className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        invoice.status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDeleteInvoice(invoice.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
          </p>
          <div className="flex space-x-2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1"
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage((p) => (p * itemsPerPage < filteredInvoices.length ? p + 1 : p))}
              disabled={currentPage * itemsPerPage >= filteredInvoices.length}
              className="px-3 py-1"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;