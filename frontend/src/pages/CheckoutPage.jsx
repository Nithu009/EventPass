import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, ShieldCheck, Clock, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Loader } from '../components/common/Loader';

export const CheckoutPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const lockToken = params.get('lockToken');
  const eventId = params.get('eventId');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [simulateSuccess, setSimulateSuccess] = useState(true);

  useEffect(() => {
    if (!lockToken) {
      setErrorMsg('No active reservation lock found. Please select your seats again.');
      setLoading(false);
      return;
    }

    // Convert lock into booking
    api.post('/bookings', { lockToken })
      .then((res) => {
        setBooking(res.data);
      })
      .catch((err) => {
        setErrorMsg(err?.message || 'Failed to initialize booking from your reservation lock.');
      })
      .finally(() => setLoading(false));
  }, [lockToken]);

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!booking) return;

    setPaying(true);
    setErrorMsg('');

    try {
      const res = await api.post('/payments/process', {
        bookingId: booking.id,
        paymentMethod: paymentMethod,
        cardLastFour: '4242',
        simulateSuccess: simulateSuccess,
      });

      if (simulateSuccess) {
        navigate(`/payment-status?status=success&bookingId=${booking.id}`);
      } else {
        navigate(`/payment-status?status=failed&bookingId=${booking.id}`);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Transaction could not be completed.');
      setPaying(false);
    }
  };

  if (loading) return <Loader fullPage message="Locking in your reservation order..." />;

  if (errorMsg && !booking) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '600px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Reservation Unavailable</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>{errorMsg}</p>
          <button onClick={() => navigate(eventId ? `/events/${eventId}/seats` : '/events')} className="btn btn-primary">
            Return to Seat Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '960px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>Review & Checkout</h1>
        <p style={{ color: '#94a3b8' }}>
          Booking Ref: <strong style={{ color: '#6366f1' }}>{booking?.bookingReference}</strong>
        </p>
      </div>

      {errorMsg && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          padding: '0.875rem 1.25rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem'
        }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Payment Form & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Payment Method Selector */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc' }}>
              Select Payment Method
            </h3>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {['CREDIT_CARD', 'UPI', 'NET_BANKING'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    flex: 1,
                    minWidth: '120px',
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: paymentMethod === method ? 'rgba(99, 102, 241, 0.15)' : '#101726',
                    border: `1.5px solid ${paymentMethod === method ? '#6366f1' : '#1e293b'}`,
                    color: paymentMethod === method ? '#fff' : '#94a3b8',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  {method === 'CREDIT_CARD' ? 'Card Payment' : method === 'UPI' ? 'UPI / QR' : 'Net Banking'}
                </button>
              ))}
            </div>

            <form onSubmit={handleProcessPayment}>
              {paymentMethod === 'CREDIT_CARD' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Card Number (Simulated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Valid Thru</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input
                        type="password"
                        className="form-control"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '1rem', backgroundColor: '#101726', borderRadius: '8px', color: '#94a3b8', fontSize: '0.875rem' }}>
                  Standard simulated {paymentMethod} gateway ready. Click confirm below to authenticate.
                </div>
              )}

              {/* Simulation Mode Toggle (Academic Testing) */}
              <div style={{
                marginTop: '1.5rem',
                padding: '0.875rem',
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                border: '1px dashed #334155',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '0.8125rem' }}>
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>Simulate Gateway Outcome:</span>
                  <p style={{ color: '#64748b', margin: 0 }}>Demonstrate payment success or failure handling</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSimulateSuccess(!simulateSuccess)}
                  className={`btn btn-sm ${simulateSuccess ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {simulateSuccess ? '✓ Success' : '✗ Failure'}
                </button>
              </div>

              <button
                type="submit"
                disabled={paying}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1.5rem', padding: '0.875rem' }}
              >
                <CreditCard size={18} /> {paying ? 'Verifying Transaction...' : `Pay ₹${(booking?.totalAmount || 0).toLocaleString()}`}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="card" style={{ position: 'sticky', top: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem', color: '#f8fafc' }}>
            Order Summary
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.25rem' }}>
              {booking?.eventTitle}
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
              {booking?.venueName}
            </p>
          </div>

          <div style={{ borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {(booking?.items || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#cbd5e1' }}>
                  Seat <strong>{item.seatCode}</strong> ({item.seatCategory || item.category})
                </span>
                <span style={{ fontWeight: 600 }}>₹{(item.finalPrice || item.priceSnapshot || 0).toLocaleString()}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px dashed #1e293b', paddingTop: '0.625rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#94a3b8' }}>
              <span>Subtotal:</span>
              <span>₹{(booking?.subtotal || 0).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#94a3b8' }}>
              <span>Service Fee (5%):</span>
              <span>₹{(booking?.serviceFee || 0).toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f8fafc' }}>Total Payable:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
              ₹{(booking?.totalAmount || 0).toLocaleString()}
            </span>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>256-bit TLS encrypted transaction reconciliation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
