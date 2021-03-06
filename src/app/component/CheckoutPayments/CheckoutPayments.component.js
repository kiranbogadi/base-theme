/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CheckoutPayment from 'Component/CheckoutPayment';
import { paymentMethodsType } from 'Type/Checkout';
import Braintree from 'Component/Braintree';
import PayPal from 'Component/PayPal';
import Klarna from 'Component/Klarna';

import './CheckoutPayments.style';

export const KLARNA = 'klarna_kp';
export const BRAINTREE = 'braintree';
export const CHECK_MONEY = 'checkmo';
export const PAYPAL_EXPRESS = 'paypal_express';
export const PAYPAL_EXPRESS_CREDIT = 'paypal_express_bml';

class CheckoutPayments extends PureComponent {
    static propTypes = {
        showError: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        setDetailsStep: PropTypes.func.isRequired,
        selectPaymentMethod: PropTypes.func.isRequired,
        initBraintree: PropTypes.func.isRequired,
        paymentMethods: paymentMethodsType.isRequired,
        setOrderButtonVisibility: PropTypes.func.isRequired,
        setOrderButtonEnableStatus: PropTypes.func.isRequired,
        selectedPaymentCode: PropTypes.oneOf([
            KLARNA,
            BRAINTREE,
            CHECK_MONEY,
            PAYPAL_EXPRESS,
            PAYPAL_EXPRESS_CREDIT
        ]).isRequired
    };

    paymentRenderMap = {
        [KLARNA]: this.renderKlarnaPayment.bind(this),
        [BRAINTREE]: this.renderBrainTreePayment.bind(this)
    };

    componentDidUpdate(prevProps) {
        const { selectedPaymentCode, setOrderButtonVisibility } = this.props;
        const { selectedPaymentCode: prevSelectedPaymentCode } = prevProps;

        if (selectedPaymentCode !== prevSelectedPaymentCode) {
            if (selectedPaymentCode === PAYPAL_EXPRESS) {
                setOrderButtonVisibility(false);
            }

            if (prevSelectedPaymentCode === PAYPAL_EXPRESS) {
                setOrderButtonVisibility(true);
            }
        }
    }

    componentDidCatch(error, info) {
        const { showError } = this.props;
        // eslint-disable-next-line no-console
        console.error(error, info);
        showError(`${error} Please try again later`);
    }

    renderBrainTreePayment() {
        const { initBraintree } = this.props;
        return <Braintree init={ initBraintree } />;
    }

    renderKlarnaPayment() {
        const { setOrderButtonEnableStatus } = this.props;
        return <Klarna setOrderButtonEnableStatus={ setOrderButtonEnableStatus } />;
    }

    renderPayment = (method) => {
        const {
            selectPaymentMethod,
            selectedPaymentCode
        } = this.props;

        const { code } = method;
        const isSelected = selectedPaymentCode === code;

        return (
            <CheckoutPayment
              key={ code }
              isSelected={ isSelected }
              method={ method }
              onClick={ selectPaymentMethod }
            />
        );
    };

    renderPayments() {
        const { paymentMethods } = this.props;
        return paymentMethods.map(this.renderPayment);
    }

    renderSelectedPayment() {
        const { selectedPaymentCode } = this.props;
        const render = this.paymentRenderMap[selectedPaymentCode];
        if (!render) return null;
        return render();
    }

    renderHeading() {
        return (
            <h2 block="Checkout" elem="Heading">
                { __('Select payment method') }
            </h2>
        );
    }

    renderPayPal() {
        const { selectedPaymentCode, setLoading, setDetailsStep } = this.props;

        return (
            <PayPal
              setLoading={ setLoading }
              setDetailsStep={ setDetailsStep }
              selectedPaymentCode={ selectedPaymentCode }
            />
        );
    }

    render() {
        return (
            <div block="CheckoutPayments">
                { this.renderHeading() }
                <ul block="CheckoutPayments" elem="Methods">
                    { this.renderPayments() }
                </ul>
                { this.renderSelectedPayment() }
                { this.renderPayPal() }
            </div>
        );
    }
}

export default CheckoutPayments;
