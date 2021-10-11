import Axios from "axios";
import React, { Component } from "react";
import { IoIosFlash } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { TiLockClosed } from "react-icons/ti";
import { translate } from "./Translate";

class TestSoan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentList: [],
      noPaymentList: [],

      checkboxList: [],
      totalPrice: 0,
    };

    this.formulaireRef = React.createRef();
    this.handleClick = this.handleClick.bind(this);

    this.spanNoPayed = React.createRef();
    this.spanPayed = React.createRef();

    this.blocNoPayed = React.createRef();
    this.blocPayed = React.createRef();
    this.buttonInvoice = this.buttonInvoice.bind(this);
    this.buttonInvoice2 = this.buttonInvoice2.bind(this);

    this.checkboxPrice = this.checkboxPrice.bind(this);
  }

  componentDidMount() {
    const { checkboxList } = this.state;

    Axios.get("https://test.soan-solutions.io/test_front/datas").then(
      (datas) => {
        const paymentList = [];
        const noPaymentList = [];

        datas.data.payments.forEach((payment, index) => {
          payment.amount = (payment.amount / 100).toFixed(2);
          if (payment.payedDate === null) {
            noPaymentList.push(payment);
            checkboxList.push(false);
          } else {
            paymentList.push(payment);
          }
        });

        this.setState({
          paymentList,
          noPaymentList,
          checkboxList,
        });
      }
    );
  }

  checkboxPrice(index) {
    const { checkboxList, noPaymentList } = this.state;
    let { totalPrice } = this.state;

    checkboxList[index] = !checkboxList[index];

    if (checkboxList[index]) {
      totalPrice += +noPaymentList[index].amount;
    } else {
      totalPrice -= +noPaymentList[index].amount;
    }

    this.setState({ checkboxList, totalPrice });
  }

  handleClick() {
    this.formulaireRef.current.style.display =
      this.formulaireRef.current.style.display === "flex" ? "none" : "flex";
  }

  buttonInvoice() {
    this.blocNoPayed.current.style.display = "block";
    this.blocPayed.current.style.display = "none";

    this.spanNoPayed.current.style.display = "block";
    this.spanPayed.current.style.display = "none";
  }

  buttonInvoice2() {
    this.blocPayed.current.style.display = "block";
    this.blocNoPayed.current.style.display = "none";

    this.spanPayed.current.style.display = "block";
    this.spanNoPayed.current.style.display = "none";
  }

  render() {
    const { paymentList, noPaymentList, checkboxList, totalPrice } = this.state;

    return (
      <section>
        <div className="centerContainer">
          <div className="container">
            <nav>
              <ul>
                <button type="button" onClick={this.buttonInvoice}>
                  Factures à payer
                  <span className="spanNoPayed" ref={this.spanNoPayed}></span>
                </button>
                <button type="button" onClick={this.buttonInvoice2}>
                  Factures payées
                  <span className="spanPayed" ref={this.spanPayed}></span>
                </button>
              </ul>
            </nav>

            <div className="blocNoPayed" ref={this.blocNoPayed}>
              {noPaymentList.map((payment, index) => (
                <div key={payment.id} className="displayBlocNoPayed">
                  <div className="blocCheckbox">
                    <input
                      type="checkbox"
                      checked={checkboxList[index] === true}
                      onClick={() => this.checkboxPrice(index)}
                    />
                  </div>
                  <div className="blocFact">
                    <p>{payment.invoiceNumber}</p>
                    <p className="maxDaysToPay">
                      A régler avant le {payment.maxDaysToPay}
                    </p>
                  </div>
                  <div className="blocRed">
                    {payment.discount !== null && (
                      <>
                        <p className="escompte">
                          <IoIosFlash />
                          Escompte
                        </p>
                        <p className="discount">
                          -{payment.discount?.rate}% pendant{" "}
                          {payment.discount?.maxDaysToPay} jours
                        </p>
                        {payment.multiPaymentStatus !== "NONE" && (
                          <div className="spacer"></div>
                        )}
                      </>
                    )}

                    {payment.multiPaymentStatus === "AVAILABLE" && (
                      <p className="sansFrais">
                        <IoIosFlash />
                        3x sans frais
                      </p>
                    )}
                    <p className="multiPaymentStatus">
                      {translate(payment.multiPaymentStatus)}
                    </p>
                  </div>
                  <div className="blocPrix">
                    <p>{payment.amount} €</p>
                  </div>
                </div>
              ))}

              <div className="blocResult">
                <button type="button" onClick={this.handleClick}>
                  Payer {totalPrice} €
                </button>
              </div>
            </div>

            <div className="blocPayed" ref={this.blocPayed}>
              {paymentList.map((payment) => (
                <div key={payment.id} className="displayBlocPayed">
                  <div className="blocFact">
                    <p>{payment.invoiceNumber}</p>
                    <p className="maxDaysToPay">
                      Réglée le {payment.payedDate}
                    </p>
                  </div>
                  <div className="blocRedBis">
                    {payment.discount !== null && (
                      <>
                        <p className="escompte">
                          <IoIosFlash />
                          Escompte
                        </p>
                        <p className=" discount">Utilisé</p>
                        {payment.multiPaymentStatus !== "NONE" && (
                          <div className="spacer"></div>
                        )}
                      </>
                    )}
                    {payment.multiPaymentStatus === "USED" && (
                      <p className="sansFrais">
                        <IoIosFlash />
                        3x sans frais
                      </p>
                    )}
                    <p className="multiPaymentStatus">
                      {translate(payment.multiPaymentStatus)}
                    </p>
                  </div>
                  <div className="blocPrixBis">
                    <p>{payment.amount} €</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="paymentSecu">
            <TiLockClosed />
            <p>Paiement en ligne 100 % sécurisé</p>
          </div>
        </div>

        <form
          className="formulaire"
          action="#"
          method="POST"
          ref={this.formulaireRef}
        >
          <fieldset className="blocFormulaire">
            <span onClick={this.handleClick}>
              <MdClose />
            </span>
            <div className="marginFormulaire">
              <div className="titreFormulaire">
                <p>Paiement sécurisé par prélèvement bancaire</p>
              </div>
              <div className="mandat">
                <p>Mise en place d'un mandat SEPA MANGOPAY</p>
              </div>

              <div className="titulaireCompte">
                <label>
                  Titulaire du compte <span>*</span>
                </label>
                <input
                  type="text"
                  name="titulaire du compte"
                  placeholder="Titulaire du compte"
                  required
                />
              </div>
              <div className="adresse">
                <label>
                  Adresse du titulaire <span>*</span>
                </label>
                <input
                  type="text"
                  name="Adresse du titulaire"
                  placeholder="Adresse du titulaire"
                  required
                />
              </div>

              <div className="blocVille">
                <div className="ville">
                  <label>
                    Ville <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="Ville"
                    placeholder="Ville"
                    required
                  />
                </div>
                <div className="region">
                  <label>
                    Région <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="Région"
                    placeholder="Région"
                    required
                  />
                </div>
              </div>
              <div className="blocPays">
                <div className="codePostal">
                  <label>
                    Code Postal <span>*</span>
                  </label>
                  <input
                    name="Code Postal"
                    placeholder="Code Postal"
                    type="number"
                    min="10000"
                    required
                  />
                </div>
                <div className="pays">
                  <label>
                    Pays <span>*</span>
                  </label>
                  <select name="Pays" placeholder="Pays" required>
                    <option value=""></option>
                    <option value="France">France</option>
                    <option value="Allemagne">Allemagne</option>
                    <option value="Angleterre">Angleterre</option>
                    <option value="Espagne">Espagne</option>
                  </select>
                </div>
              </div>
              <div className="iban">
                <label>
                  IBAN <span>*</span>
                </label>
                <input type="text" name="IBAN" required />
              </div>
              <div className="blocResultFormulaire">
                <button
                  type="button"
                  className="btnPayedFormulaire"
                  onClick={this.handleClick}
                >
                  Payer {totalPrice} €
                </button>
                <button
                  type="button"
                  className="annuler"
                  onClick={this.handleClick}
                  type="submit"
                >
                  Annuler
                </button>
              </div>
            </div>
          </fieldset>
        </form>
      </section>
    );
  }
}

{
}

export default TestSoan;
