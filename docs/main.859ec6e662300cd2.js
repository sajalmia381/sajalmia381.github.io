"use strict";
(self.webpackChunksajalmia_resume = self.webpackChunksajalmia_resume || []).push([
  [179],
  {
    957: () => {
      function se(e) {
        return "function" == typeof e;
      }
      function Oi(e) {
        const n = e(r => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (n.prototype = Object.create(Error.prototype)), (n.prototype.constructor = n), n;
      }
      const us = Oi(
        e =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, i) => `${i + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function Fi(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class St {
        constructor(t) {
          (this.initialTeardown = t), (this.closed = !1), (this._parentage = null), (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n))) for (const o of n) o.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (se(r))
              try {
                r();
              } catch (o) {
                t = o instanceof us ? o.errors : [o];
              }
            const { _finalizers: i } = this;
            if (i) {
              this._finalizers = null;
              for (const o of i)
                try {
                  bh(o);
                } catch (s) {
                  (t = t ?? []), s instanceof us ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new us(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) bh(t);
            else {
              if (t instanceof St) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers = null !== (n = this._finalizers) && void 0 !== n ? n : []).push(t);
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && Fi(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && Fi(n, t), t instanceof St && t._removeParent(this);
        }
      }
      St.EMPTY = (() => {
        const e = new St();
        return (e.closed = !0), e;
      })();
      const Eh = St.EMPTY;
      function Ch(e) {
        return e instanceof St || (e && "closed" in e && se(e.remove) && se(e.add) && se(e.unsubscribe));
      }
      function bh(e) {
        se(e) ? e() : e.unsubscribe();
      }
      const nr = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        cs = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = cs;
            return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = cs;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function Sh(e) {
        cs.setTimeout(() => {
          const { onUnhandledError: t } = nr;
          if (!t) throw e;
          t(e);
        });
      }
      function Mh() {}
      const FC = kl("C", void 0, void 0);
      function kl(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let rr = null;
      function ds(e) {
        if (nr.useDeprecatedSynchronousErrorHandling) {
          const t = !rr;
          if ((t && (rr = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = rr;
            if (((rr = null), n)) throw r;
          }
        } else e();
      }
      class Ll extends St {
        constructor(t) {
          super(), (this.isStopped = !1), t ? ((this.destination = t), Ch(t) && t.add(this)) : (this.destination = $C);
        }
        static create(t, n, r) {
          return new ki(t, n, r);
        }
        next(t) {
          this.isStopped
            ? Bl(
                (function LC(e) {
                  return kl("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? Bl(
                (function kC(e) {
                  return kl("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped ? Bl(FC, this) : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed || ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const BC = Function.prototype.bind;
      function jl(e, t) {
        return BC.call(e, t);
      }
      class VC {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              fs(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              fs(r);
            }
          else fs(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              fs(n);
            }
        }
      }
      class ki extends Ll {
        constructor(t, n, r) {
          let i;
          if ((super(), se(t) || !t)) i = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
          else {
            let o;
            this && nr.useDeprecatedNextContext
              ? ((o = Object.create(t)),
                (o.unsubscribe = () => this.unsubscribe()),
                (i = {
                  next: t.next && jl(t.next, o),
                  error: t.error && jl(t.error, o),
                  complete: t.complete && jl(t.complete, o),
                }))
              : (i = t);
          }
          this.destination = new VC(i);
        }
      }
      function fs(e) {
        nr.useDeprecatedSynchronousErrorHandling
          ? (function jC(e) {
              nr.useDeprecatedSynchronousErrorHandling && rr && ((rr.errorThrown = !0), (rr.error = e));
            })(e)
          : Sh(e);
      }
      function Bl(e, t) {
        const { onStoppedNotification: n } = nr;
        n && cs.setTimeout(() => n(e, t));
      }
      const $C = {
          closed: !0,
          next: Mh,
          error: function HC(e) {
            throw e;
          },
          complete: Mh,
        },
        Vl = ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function ir(e) {
        return e;
      }
      function Th(e) {
        return 0 === e.length
          ? ir
          : 1 === e.length
          ? e[0]
          : function (n) {
              return e.reduce((r, i) => i(r), n);
            };
      }
      let Ee = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, i) {
            const o = (function qC(e) {
              return (
                (e && e instanceof Ll) ||
                ((function zC(e) {
                  return e && se(e.next) && se(e.error) && se(e.complete);
                })(e) &&
                  Ch(e))
              );
            })(n)
              ? n
              : new ki(n, r, i);
            return (
              ds(() => {
                const { operator: s, source: a } = this;
                o.add(s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o));
              }),
              o
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = Ih(r))((i, o) => {
              const s = new ki({
                next: a => {
                  try {
                    n(a);
                  } catch (l) {
                    o(l), s.unsubscribe();
                  }
                },
                error: o,
                complete: i,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r ? void 0 : r.subscribe(n);
          }
          [Vl]() {
            return this;
          }
          pipe(...n) {
            return Th(n)(this);
          }
          toPromise(n) {
            return new (n = Ih(n))((r, i) => {
              let o;
              this.subscribe(
                s => (o = s),
                s => i(s),
                () => r(o)
              );
            });
          }
        }
        return (e.create = t => new e(t)), e;
      })();
      function Ih(e) {
        var t;
        return null !== (t = e ?? nr.Promise) && void 0 !== t ? t : Promise;
      }
      const GC = Oi(
        e =>
          function () {
            e(this), (this.name = "ObjectUnsubscribedError"), (this.message = "object unsubscribed");
          }
      );
      let yn = (() => {
        class e extends Ee {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new Ah(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new GC();
          }
          next(n) {
            ds(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers || (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            ds(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            ds(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (null === (n = this.observers) || void 0 === n ? void 0 : n.length) > 0;
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n);
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: i, observers: o } = this;
            return r || i
              ? Eh
              : ((this.currentObservers = null),
                o.push(n),
                new St(() => {
                  (this.currentObservers = null), Fi(o, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: i, isStopped: o } = this;
            r ? n.error(i) : o && n.complete();
          }
          asObservable() {
            const n = new Ee();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new Ah(t, n)), e;
      })();
      class Ah extends yn {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null === (r = null === (n = this.destination) || void 0 === n ? void 0 : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null === (r = null === (n = this.destination) || void 0 === n ? void 0 : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null === (n = null === (t = this.destination) || void 0 === t ? void 0 : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !== (r = null === (n = this.source) || void 0 === n ? void 0 : n.subscribe(t)) && void 0 !== r
            ? r
            : Eh;
        }
      }
      function Nh(e) {
        return se(e?.lift);
      }
      function Le(e) {
        return t => {
          if (Nh(t))
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function je(e, t, n, r, i) {
        return new WC(e, t, n, r, i);
      }
      class WC extends Ll {
        constructor(t, n, r, i, o, s) {
          super(t),
            (this.onFinalize = o),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (l) {
                    t.error(l);
                  }
                }
              : super._next),
            (this._error = i
              ? function (a) {
                  try {
                    i(a);
                  } catch (l) {
                    t.error(l);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(), !n && (null === (t = this.onFinalize) || void 0 === t || t.call(this));
          }
        }
      }
      function te(e, t) {
        return Le((n, r) => {
          let i = 0;
          n.subscribe(
            je(r, o => {
              r.next(e.call(t, o, i++));
            })
          );
        });
      }
      function Vn(e) {
        return this instanceof Vn ? ((this.v = e), this) : new Vn(e);
      }
      function Oh(e) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function zl(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e };
                  },
                };
              throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(o) {
          n[o] =
            e[o] &&
            function (s) {
              return new Promise(function (a, l) {
                !(function i(o, s, a, l) {
                  Promise.resolve(l).then(function (u) {
                    o({ value: u, done: a });
                  }, s);
                })(a, l, (s = e[o](s)).done, s.value);
              });
            };
        }
      }
      const Fh = e => e && "number" == typeof e.length && "function" != typeof e;
      function kh(e) {
        return se(e?.then);
      }
      function Lh(e) {
        return se(e[Vl]);
      }
      function jh(e) {
        return Symbol.asyncIterator && se(e?.[Symbol.asyncIterator]);
      }
      function Bh(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Vh = (function h0() {
        return "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator";
      })();
      function Hh(e) {
        return se(e?.[Vh]);
      }
      function $h(e) {
        return (function xh(e, t, n) {
          if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
          var i,
            r = n.apply(e, t || []),
            o = [];
          return (
            (i = {}),
            s("next"),
            s("throw"),
            s("return"),
            (i[Symbol.asyncIterator] = function () {
              return this;
            }),
            i
          );
          function s(f) {
            r[f] &&
              (i[f] = function (h) {
                return new Promise(function (p, g) {
                  o.push([f, h, p, g]) > 1 || a(f, h);
                });
              });
          }
          function a(f, h) {
            try {
              !(function l(f) {
                f.value instanceof Vn ? Promise.resolve(f.value.v).then(u, c) : d(o[0][2], f);
              })(r[f](h));
            } catch (p) {
              d(o[0][3], p);
            }
          }
          function u(f) {
            a("next", f);
          }
          function c(f) {
            a("throw", f);
          }
          function d(f, h) {
            f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
          }
        })(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: i } = yield Vn(n.read());
              if (i) return yield Vn(void 0);
              yield yield Vn(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function Uh(e) {
        return se(e?.getReader);
      }
      function Lt(e) {
        if (e instanceof Ee) return e;
        if (null != e) {
          if (Lh(e))
            return (function p0(e) {
              return new Ee(t => {
                const n = e[Vl]();
                if (se(n.subscribe)) return n.subscribe(t);
                throw new TypeError("Provided object does not correctly implement Symbol.observable");
              });
            })(e);
          if (Fh(e))
            return (function g0(e) {
              return new Ee(t => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (kh(e))
            return (function m0(e) {
              return new Ee(t => {
                e.then(
                  n => {
                    t.closed || (t.next(n), t.complete());
                  },
                  n => t.error(n)
                ).then(null, Sh);
              });
            })(e);
          if (jh(e)) return zh(e);
          if (Hh(e))
            return (function y0(e) {
              return new Ee(t => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (Uh(e))
            return (function v0(e) {
              return zh($h(e));
            })(e);
        }
        throw Bh(e);
      }
      function zh(e) {
        return new Ee(t => {
          (function D0(e, t) {
            var n, r, i, o;
            return (function Rh(e, t, n, r) {
              return new (n || (n = Promise))(function (o, s) {
                function a(c) {
                  try {
                    u(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  try {
                    u(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  c.done
                    ? o(c.value)
                    : (function i(o) {
                        return o instanceof n
                          ? o
                          : new n(function (s) {
                              s(o);
                            });
                      })(c.value).then(a, l);
                }
                u((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = Oh(e); !(r = yield n.next()).done; ) if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                i = { error: s };
              } finally {
                try {
                  r && !r.done && (o = n.return) && (yield o.call(n));
                } finally {
                  if (i) throw i.error;
                }
              }
              t.complete();
            });
          })(e, t).catch(n => t.error(n));
        });
      }
      function vn(e, t, n, r = 0, i = !1) {
        const o = t.schedule(function () {
          n(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(o), !i)) return o;
      }
      function Be(e, t, n = 1 / 0) {
        return se(t)
          ? Be((r, i) => te((o, s) => t(r, o, i, s))(Lt(e(r, i))), n)
          : ("number" == typeof t && (n = t),
            Le((r, i) =>
              (function _0(e, t, n, r, i, o, s, a) {
                const l = [];
                let u = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !l.length && !u && t.complete();
                  },
                  h = g => (u < r ? p(g) : l.push(g)),
                  p = g => {
                    o && t.next(g), u++;
                    let y = !1;
                    Lt(n(g, c++)).subscribe(
                      je(
                        t,
                        v => {
                          i?.(v), o ? h(v) : t.next(v);
                        },
                        () => {
                          y = !0;
                        },
                        void 0,
                        () => {
                          if (y)
                            try {
                              for (u--; l.length && u < r; ) {
                                const v = l.shift();
                                s ? vn(t, s, () => p(v)) : p(v);
                              }
                              f();
                            } catch (v) {
                              t.error(v);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    je(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, i, e, n)
            ));
      }
      function Pr(e = 1 / 0) {
        return Be(ir, e);
      }
      const Yt = new Ee(e => e.complete());
      function ql(e) {
        return e[e.length - 1];
      }
      function Li(e) {
        return (function E0(e) {
          return e && se(e.schedule);
        })(ql(e))
          ? e.pop()
          : void 0;
      }
      function qh(e, t = 0) {
        return Le((n, r) => {
          n.subscribe(
            je(
              r,
              i => vn(r, e, () => r.next(i), t),
              () => vn(r, e, () => r.complete(), t),
              i => vn(r, e, () => r.error(i), t)
            )
          );
        });
      }
      function Gh(e, t = 0) {
        return Le((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function Wh(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new Ee(n => {
          vn(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            vn(
              n,
              t,
              () => {
                r.next().then(i => {
                  i.done ? n.complete() : n.next(i.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function Oe(e, t) {
        return t
          ? (function N0(e, t) {
              if (null != e) {
                if (Lh(e))
                  return (function S0(e, t) {
                    return Lt(e).pipe(Gh(t), qh(t));
                  })(e, t);
                if (Fh(e))
                  return (function T0(e, t) {
                    return new Ee(n => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (kh(e))
                  return (function M0(e, t) {
                    return Lt(e).pipe(Gh(t), qh(t));
                  })(e, t);
                if (jh(e)) return Wh(e, t);
                if (Hh(e))
                  return (function I0(e, t) {
                    return new Ee(n => {
                      let r;
                      return (
                        vn(n, t, () => {
                          (r = e[Vh]()),
                            vn(
                              n,
                              t,
                              () => {
                                let i, o;
                                try {
                                  ({ value: i, done: o } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                o ? n.complete() : n.next(i);
                              },
                              0,
                              !0
                            );
                        }),
                        () => se(r?.return) && r.return()
                      );
                    });
                  })(e, t);
                if (Uh(e))
                  return (function A0(e, t) {
                    return Wh($h(e), t);
                  })(e, t);
              }
              throw Bh(e);
            })(e, t)
          : Lt(e);
      }
      function Gl(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new ki({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return Lt(t(...n)).subscribe(r);
      }
      function ie(e) {
        for (let t in e) if (e[t] === ie) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function Ae(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(Ae).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function Kl(e, t) {
        return null == e || "" === e ? (null === t ? "" : t) : null == t || "" === t ? e : e + " " + t;
      }
      const x0 = ie({ __forward_ref__: ie });
      function Ql(e) {
        return (
          (e.__forward_ref__ = Ql),
          (e.toString = function () {
            return Ae(this());
          }),
          e
        );
      }
      function $(e) {
        return Zl(e) ? e() : e;
      }
      function Zl(e) {
        return "function" == typeof e && e.hasOwnProperty(x0) && e.__forward_ref__ === Ql;
      }
      function Yl(e) {
        return e && !!e.ɵproviders;
      }
      const Kh = "https://g.co/ng/security#xss";
      class D extends Error {
        constructor(t, n) {
          super(
            (function hs(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function U(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function ps(e, t) {
        throw new D(-201, !1);
      }
      function Mt(e, t) {
        null == e &&
          (function re(e, t, n, r) {
            throw new Error(`ASSERTION ERROR: ${e}` + (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`));
          })(t, e, null, "!=");
      }
      function P(e) {
        return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
      }
      function jt(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function gs(e) {
        return Qh(e, ms) || Qh(e, Yh);
      }
      function Qh(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function Zh(e) {
        return e && (e.hasOwnProperty(Xl) || e.hasOwnProperty(H0)) ? e[Xl] : null;
      }
      const ms = ie({ ɵprov: ie }),
        Xl = ie({ ɵinj: ie }),
        Yh = ie({ ngInjectableDef: ie }),
        H0 = ie({ ngInjectorDef: ie });
      var F = (() => (
        ((F = F || {})[(F.Default = 0)] = "Default"),
        (F[(F.Host = 1)] = "Host"),
        (F[(F.Self = 2)] = "Self"),
        (F[(F.SkipSelf = 4)] = "SkipSelf"),
        (F[(F.Optional = 8)] = "Optional"),
        F
      ))();
      let Jl;
      function tt(e) {
        const t = Jl;
        return (Jl = e), t;
      }
      function Jh(e, t, n) {
        const r = gs(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & F.Optional
          ? null
          : void 0 !== t
          ? t
          : void ps(Ae(e));
      }
      const le = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" && typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && self))(),
        ji = {},
        eu = "__NG_DI_FLAG__",
        ys = "ngTempTokenPath",
        U0 = /\n/gm,
        ep = "__source";
      let xr;
      function $n(e) {
        const t = xr;
        return (xr = e), t;
      }
      function G0(e, t = F.Default) {
        if (void 0 === xr) throw new D(-203, !1);
        return null === xr ? Jh(e, void 0, t) : xr.get(e, t & F.Optional ? null : void 0, t);
      }
      function M(e, t = F.Default) {
        return (
          (function Xh() {
            return Jl;
          })() || G0
        )($(e), t);
      }
      function I(e, t = F.Default) {
        return M(e, vs(t));
      }
      function vs(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
      }
      function tu(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = $(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new D(900, !1);
            let i,
              o = F.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                l = W0(a);
              "number" == typeof l ? (-1 === l ? (i = a.token) : (o |= l)) : (i = a);
            }
            t.push(M(i, o));
          } else t.push(M(r));
        }
        return t;
      }
      function Bi(e, t) {
        return (e[eu] = t), (e.prototype[eu] = t), e;
      }
      function W0(e) {
        return e[eu];
      }
      function Dn(e) {
        return { toString: e }.toString();
      }
      var Xt = (() => (((Xt = Xt || {})[(Xt.OnPush = 0)] = "OnPush"), (Xt[(Xt.Default = 1)] = "Default"), Xt))(),
        nt = (() => {
          return (
            ((e = nt || (nt = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            nt
          );
          var e;
        })();
      const _n = {},
        J = [],
        Ds = ie({ ɵcmp: ie }),
        nu = ie({ ɵdir: ie }),
        ru = ie({ ɵpipe: ie }),
        np = ie({ ɵmod: ie }),
        wn = ie({ ɵfac: ie }),
        Vi = ie({ __NG_ELEMENT_ID__: ie }),
        rp = ie({ __NG_ENV_ID__: ie });
      function ip(e, t, n) {
        let r = e.length;
        for (;;) {
          const i = e.indexOf(t, n);
          if (-1 === i) return i;
          if (0 === i || e.charCodeAt(i - 1) <= 32) {
            const o = t.length;
            if (i + o === r || e.charCodeAt(i + o) <= 32) return i;
          }
          n = i + 1;
        }
      }
      function iu(e, t, n) {
        let r = 0;
        for (; r < n.length; ) {
          const i = n[r];
          if ("number" == typeof i) {
            if (0 !== i) break;
            r++;
            const o = n[r++],
              s = n[r++],
              a = n[r++];
            e.setAttribute(t, s, a, o);
          } else {
            const o = i,
              s = n[++r];
            sp(o) ? e.setProperty(t, o, s) : e.setAttribute(t, o, s), r++;
          }
        }
        return r;
      }
      function op(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function sp(e) {
        return 64 === e.charCodeAt(0);
      }
      function Hi(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const i = t[r];
              "number" == typeof i ? (n = i) : 0 === n || ap(e, n, i, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function ap(e, t, n, r, i) {
        let o = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; o < e.length; ) {
            const a = e[o++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = o - 1;
                break;
              }
            }
          }
        for (; o < e.length; ) {
          const a = e[o];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== i && (e[o + 1] = i));
            if (r === e[o + 1]) return void (e[o + 2] = i);
          }
          o++, null !== r && o++, null !== i && o++;
        }
        -1 !== s && (e.splice(s, 0, t), (o = s + 1)),
          e.splice(o++, 0, n),
          null !== r && e.splice(o++, 0, r),
          null !== i && e.splice(o++, 0, i);
      }
      const lp = "ng-template";
      function Z0(e, t, n) {
        let r = 0,
          i = !0;
        for (; r < e.length; ) {
          let o = e[r++];
          if ("string" == typeof o && i) {
            const s = e[r++];
            if (n && "class" === o && -1 !== ip(s.toLowerCase(), t, 0)) return !0;
          } else {
            if (1 === o) {
              for (; r < e.length && "string" == typeof (o = e[r++]); ) if (o.toLowerCase() === t) return !0;
              return !1;
            }
            "number" == typeof o && (i = !1);
          }
        }
        return !1;
      }
      function up(e) {
        return 4 === e.type && e.value !== lp;
      }
      function Y0(e, t, n) {
        return t === (4 !== e.type || n ? e.value : lp);
      }
      function X0(e, t, n) {
        let r = 4;
        const i = e.attrs || [],
          o = (function tb(e) {
            for (let t = 0; t < e.length; t++) if (op(e[t])) return t;
            return e.length;
          })(i);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const l = t[a];
          if ("number" != typeof l) {
            if (!s)
              if (4 & r) {
                if (((r = 2 | (1 & r)), ("" !== l && !Y0(e, l, n)) || ("" === l && 1 === t.length))) {
                  if (Bt(r)) return !1;
                  s = !0;
                }
              } else {
                const u = 8 & r ? l : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!Z0(e.attrs, u, n)) {
                    if (Bt(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = J0(8 & r ? "class" : l, i, up(e), n);
                if (-1 === d) {
                  if (Bt(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== u) {
                  let f;
                  f = d > o ? "" : i[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== ip(h, u, 0)) || (2 & r && u !== f)) {
                    if (Bt(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !Bt(r) && !Bt(l)) return !1;
            if (s && Bt(l)) continue;
            (s = !1), (r = l | (1 & r));
          }
        }
        return Bt(r) || s;
      }
      function Bt(e) {
        return 0 == (1 & e);
      }
      function J0(e, t, n, r) {
        if (null === t) return -1;
        let i = 0;
        if (r || !n) {
          let o = !1;
          for (; i < t.length; ) {
            const s = t[i];
            if (s === e) return i;
            if (3 === s || 6 === s) o = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++i];
                for (; "string" == typeof a; ) a = t[++i];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                i += 4;
                continue;
              }
            }
            i += o ? 1 : 2;
          }
          return -1;
        }
        return (function nb(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function cp(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (X0(e, t[r], n)) return !0;
        return !1;
      }
      function dp(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function ib(e) {
        let t = e[0],
          n = 1,
          r = 2,
          i = "",
          o = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (i += "." + s) : 4 & r && (i += " " + s);
          else "" !== i && !Bt(s) && ((t += dp(o, i)), (i = "")), (r = s), (o = o || !Bt(r));
          n++;
        }
        return "" !== i && (t += dp(o, i)), t;
      }
      function Jt(e) {
        return Dn(() => {
          const t = hp(e),
            n = {
              ...t,
              decls: e.decls,
              vars: e.vars,
              template: e.template,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              onPush: e.changeDetection === Xt.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              dependencies: (t.standalone && e.dependencies) || null,
              getStandaloneInjector: null,
              data: e.data || {},
              encapsulation: e.encapsulation || nt.Emulated,
              styles: e.styles || J,
              _: null,
              schemas: e.schemas || null,
              tView: null,
              id: "",
            };
          pp(n);
          const r = e.dependencies;
          return (
            (n.directiveDefs = _s(r, !1)),
            (n.pipeDefs = _s(r, !0)),
            (n.id = (function fb(e) {
              let t = 0;
              const n = [
                e.selectors,
                e.ngContentSelectors,
                e.hostVars,
                e.hostAttrs,
                e.consts,
                e.vars,
                e.decls,
                e.encapsulation,
                e.standalone,
                e.exportAs,
                JSON.stringify(e.inputs),
                JSON.stringify(e.outputs),
                Object.getOwnPropertyNames(e.type.prototype),
                !!e.contentQueries,
                !!e.viewQuery,
              ].join("|");
              for (const i of n) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
              return (t += 2147483648), "c" + t;
            })(n)),
            n
          );
        });
      }
      function lb(e) {
        return ee(e) || Ue(e);
      }
      function ub(e) {
        return null !== e;
      }
      function en(e) {
        return Dn(() => ({
          type: e.type,
          bootstrap: e.bootstrap || J,
          declarations: e.declarations || J,
          imports: e.imports || J,
          exports: e.exports || J,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function fp(e, t) {
        if (null == e) return _n;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let i = e[r],
              o = i;
            Array.isArray(i) && ((o = i[1]), (i = i[0])), (n[i] = r), t && (t[i] = o);
          }
        return n;
      }
      function Ke(e) {
        return Dn(() => {
          const t = hp(e);
          return pp(t), t;
        });
      }
      function rt(e) {
        return {
          type: e.type,
          name: e.name,
          factory: null,
          pure: !1 !== e.pure,
          standalone: !0 === e.standalone,
          onDestroy: e.type.prototype.ngOnDestroy || null,
        };
      }
      function ee(e) {
        return e[Ds] || null;
      }
      function Ue(e) {
        return e[nu] || null;
      }
      function it(e) {
        return e[ru] || null;
      }
      function ht(e, t) {
        const n = e[np] || null;
        if (!n && !0 === t) throw new Error(`Type ${Ae(e)} does not have '\u0275mod' property.`);
        return n;
      }
      function hp(e) {
        const t = {};
        return {
          type: e.type,
          providersResolver: null,
          factory: null,
          hostBindings: e.hostBindings || null,
          hostVars: e.hostVars || 0,
          hostAttrs: e.hostAttrs || null,
          contentQueries: e.contentQueries || null,
          declaredInputs: t,
          exportAs: e.exportAs || null,
          standalone: !0 === e.standalone,
          selectors: e.selectors || J,
          viewQuery: e.viewQuery || null,
          features: e.features || null,
          setInput: null,
          findHostDirectiveDefs: null,
          hostDirectives: null,
          inputs: fp(e.inputs, t),
          outputs: fp(e.outputs),
        };
      }
      function pp(e) {
        e.features?.forEach(t => t(e));
      }
      function _s(e, t) {
        if (!e) return null;
        const n = t ? it : lb;
        return () => ("function" == typeof e ? e() : e).map(r => n(r)).filter(ub);
      }
      const Ne = 0,
        b = 1,
        G = 2,
        he = 3,
        Vt = 4,
        or = 5,
        ze = 6,
        Fr = 7,
        ye = 8,
        kr = 9,
        sr = 10,
        z = 11,
        $i = 12,
        gp = 13,
        Lr = 14,
        Ce = 15,
        Ui = 16,
        jr = 17,
        tn = 18,
        zi = 19,
        mp = 20,
        Un = 21,
        En = 22,
        ws = 23,
        Es = 24,
        Z = 25,
        ou = 1,
        yp = 2,
        nn = 7,
        Cs = 8,
        Br = 9,
        Ve = 11;
      function pt(e) {
        return Array.isArray(e) && "object" == typeof e[ou];
      }
      function ot(e) {
        return Array.isArray(e) && !0 === e[ou];
      }
      function su(e) {
        return 0 != (4 & e.flags);
      }
      function ar(e) {
        return e.componentOffset > -1;
      }
      function bs(e) {
        return 1 == (1 & e.flags);
      }
      function Ht(e) {
        return !!e.template;
      }
      function au(e) {
        return 0 != (512 & e[G]);
      }
      function lr(e, t) {
        return e.hasOwnProperty(wn) ? e[wn] : null;
      }
      let yb =
          le.WeakRef ??
          class mb {
            constructor(t) {
              this.ref = t;
            }
            deref() {
              return this.ref;
            }
          },
        Db = 0,
        rn = null,
        Ss = !1;
      function Fe(e) {
        const t = rn;
        return (rn = e), t;
      }
      class Ep {
        constructor() {
          (this.id = Db++),
            (this.ref = (function vb(e) {
              return new yb(e);
            })(this)),
            (this.producers = new Map()),
            (this.consumers = new Map()),
            (this.trackingVersion = 0),
            (this.valueVersion = 0);
        }
        consumerPollProducersForChange() {
          for (const [t, n] of this.producers) {
            const r = n.producerNode.deref();
            if (void 0 !== r && n.atTrackingVersion === this.trackingVersion) {
              if (r.producerPollStatus(n.seenValueVersion)) return !0;
            } else this.producers.delete(t), r?.consumers.delete(this.id);
          }
          return !1;
        }
        producerMayHaveChanged() {
          const t = Ss;
          Ss = !0;
          try {
            for (const [n, r] of this.consumers) {
              const i = r.consumerNode.deref();
              void 0 !== i && i.trackingVersion === r.atTrackingVersion
                ? i.onConsumerDependencyMayHaveChanged()
                : (this.consumers.delete(n), i?.producers.delete(this.id));
            }
          } finally {
            Ss = t;
          }
        }
        producerAccessed() {
          if (Ss) throw new Error("");
          if (null === rn) return;
          let t = rn.producers.get(this.id);
          void 0 === t
            ? ((t = {
                consumerNode: rn.ref,
                producerNode: this.ref,
                seenValueVersion: this.valueVersion,
                atTrackingVersion: rn.trackingVersion,
              }),
              rn.producers.set(this.id, t),
              this.consumers.set(rn.id, t))
            : ((t.seenValueVersion = this.valueVersion), (t.atTrackingVersion = rn.trackingVersion));
        }
        get hasProducers() {
          return this.producers.size > 0;
        }
        get producerUpdatesAllowed() {
          return !1 !== rn?.consumerAllowSignalWrites;
        }
        producerPollStatus(t) {
          return this.valueVersion !== t || (this.onProducerUpdateValueVersion(), this.valueVersion !== t);
        }
      }
      let Cp = null;
      const bp = () => {};
      class Cb extends Ep {
        constructor(t, n, r) {
          super(),
            (this.watch = t),
            (this.schedule = n),
            (this.dirty = !1),
            (this.cleanupFn = bp),
            (this.registerOnCleanup = i => {
              this.cleanupFn = i;
            }),
            (this.consumerAllowSignalWrites = r);
        }
        notify() {
          this.dirty || this.schedule(this), (this.dirty = !0);
        }
        onConsumerDependencyMayHaveChanged() {
          this.notify();
        }
        onProducerUpdateValueVersion() {}
        run() {
          if (((this.dirty = !1), 0 !== this.trackingVersion && !this.consumerPollProducersForChange())) return;
          const t = Fe(this);
          this.trackingVersion++;
          try {
            this.cleanupFn(), (this.cleanupFn = bp), this.watch(this.registerOnCleanup);
          } finally {
            Fe(t);
          }
        }
        cleanup() {
          this.cleanupFn();
        }
      }
      class bb {
        constructor(t, n, r) {
          (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function ur() {
        return Sp;
      }
      function Sp(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = Mb), Sb;
      }
      function Sb() {
        const e = Tp(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === _n) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function Mb(e, t, n, r) {
        const i = this.declaredInputs[n],
          o =
            Tp(e) ||
            (function Tb(e, t) {
              return (e[Mp] = t);
            })(e, { previous: _n, current: null }),
          s = o.current || (o.current = {}),
          a = o.previous,
          l = a[i];
        (s[i] = new bb(l && l.currentValue, t, a === _n)), (e[r] = t);
      }
      ur.ngInherit = !0;
      const Mp = "__ngSimpleChanges__";
      function Tp(e) {
        return e[Mp] || null;
      }
      const on = function (e, t, n) {},
        Ip = "svg";
      function fe(e) {
        for (; Array.isArray(e); ) e = e[Ne];
        return e;
      }
      function Is(e, t) {
        return fe(t[e]);
      }
      function st(e, t) {
        return fe(t[e.index]);
      }
      function Np(e, t) {
        return e.data[t];
      }
      function Vr(e, t) {
        return e[t];
      }
      function at(e, t) {
        const n = t[e];
        return pt(n) ? n : n[Ne];
      }
      function As(e) {
        return 128 == (128 & e[G]);
      }
      function zn(e, t) {
        return null == t ? null : e[t];
      }
      function Rp(e) {
        e[jr] = 0;
      }
      function xb(e) {
        1024 & e[G] || ((e[G] |= 1024), xp(e, 1));
      }
      function Pp(e) {
        1024 & e[G] && ((e[G] &= -1025), xp(e, -1));
      }
      function xp(e, t) {
        let n = e[he];
        if (null === n) return;
        n[or] += t;
        let r = n;
        for (n = n[he]; null !== n && ((1 === t && 1 === r[or]) || (-1 === t && 0 === r[or])); )
          (n[or] += t), (r = n), (n = n[he]);
      }
      const V = { lFrame: zp(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
      function kp() {
        return V.bindingsEnabled;
      }
      function _() {
        return V.lFrame.lView;
      }
      function Y() {
        return V.lFrame.tView;
      }
      function He() {
        let e = Lp();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function Lp() {
        return V.lFrame.currentTNode;
      }
      function sn(e, t) {
        const n = V.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function hu() {
        return V.lFrame.isParent;
      }
      function pu() {
        V.lFrame.isParent = !1;
      }
      function Qe() {
        const e = V.lFrame;
        let t = e.bindingRootIndex;
        return -1 === t && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
      }
      function $r() {
        return V.lFrame.bindingIndex++;
      }
      function Wb(e, t) {
        const n = V.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), gu(t);
      }
      function gu(e) {
        V.lFrame.currentDirectiveIndex = e;
      }
      function yu(e) {
        V.lFrame.currentQueryIndex = e;
      }
      function Qb(e) {
        const t = e[b];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[ze] : null;
      }
      function $p(e, t, n) {
        if (n & F.SkipSelf) {
          let i = t,
            o = e;
          for (
            ;
            !((i = i.parent), null !== i || n & F.Host || ((i = Qb(o)), null === i || ((o = o[Lr]), 10 & i.type)));

          );
          if (null === i) return !1;
          (t = i), (e = o);
        }
        const r = (V.lFrame = Up());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function vu(e) {
        const t = Up(),
          n = e[b];
        (V.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function Up() {
        const e = V.lFrame,
          t = null === e ? null : e.child;
        return null === t ? zp(e) : t;
      }
      function zp(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function qp() {
        const e = V.lFrame;
        return (V.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
      }
      const Gp = qp;
      function Du() {
        const e = qp();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function Ze() {
        return V.lFrame.selectedIndex;
      }
      function cr(e) {
        V.lFrame.selectedIndex = e;
      }
      function lt() {
        V.lFrame.currentNamespace = Ip;
      }
      function gt() {
        !(function Jb() {
          V.lFrame.currentNamespace = null;
        })();
      }
      let Kp = !0;
      function Ns() {
        return Kp;
      }
      function qn(e) {
        Kp = e;
      }
      function Rs(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const o = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: u,
              ngOnDestroy: c,
            } = o;
          s && (e.contentHooks ??= []).push(-n, s),
            a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)),
            l && (e.viewHooks ??= []).push(-n, l),
            u && ((e.viewHooks ??= []).push(n, u), (e.viewCheckHooks ??= []).push(n, u)),
            null != c && (e.destroyHooks ??= []).push(n, c);
        }
      }
      function Ps(e, t, n) {
        Qp(e, t, 3, n);
      }
      function xs(e, t, n, r) {
        (3 & e[G]) === n && Qp(e, t, n, r);
      }
      function _u(e, t) {
        let n = e[G];
        (3 & n) === t && ((n &= 4095), (n += 1), (e[G] = n));
      }
      function Qp(e, t, n, r) {
        const o = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & e[jr] : 0; l < s; l++)
          if ("number" == typeof t[l + 1]) {
            if (((a = t[l]), null != r && a >= r)) break;
          } else
            t[l] < 0 && (e[jr] += 65536),
              (a < o || -1 == o) && (tS(e, n, t, l), (e[jr] = (4294901760 & e[jr]) + l + 2)),
              l++;
      }
      function Zp(e, t) {
        on(4, e, t);
        const n = Fe(null);
        try {
          t.call(e);
        } finally {
          Fe(n), on(5, e, t);
        }
      }
      function tS(e, t, n, r) {
        const i = n[r] < 0,
          o = n[r + 1],
          a = e[i ? -n[r] : n[r]];
        i ? e[G] >> 12 < e[jr] >> 16 && (3 & e[G]) === t && ((e[G] += 4096), Zp(a, o)) : Zp(a, o);
      }
      const Ur = -1;
      class Wi {
        constructor(t, n, r) {
          (this.factory = t), (this.resolving = !1), (this.canSeeViewProviders = n), (this.injectImpl = r);
        }
      }
      function Yp(e) {
        return e !== Ur;
      }
      function Os(e) {
        return 32767 & e;
      }
      function Fs(e, t) {
        let n = (function oS(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[Lr]), n--;
        return r;
      }
      let Eu = !0;
      function ks(e) {
        const t = Eu;
        return (Eu = e), t;
      }
      const Xp = 255,
        Jp = 5;
      let sS = 0;
      const an = {};
      function Ls(e, t) {
        const n = eg(e, t);
        if (-1 !== n) return n;
        const r = t[b];
        r.firstCreatePass && ((e.injectorIndex = t.length), Cu(r.data, e), Cu(t, null), Cu(r.blueprint, null));
        const i = bu(e, t),
          o = e.injectorIndex;
        if (Yp(i)) {
          const s = Os(i),
            a = Fs(i, t),
            l = a[b].data;
          for (let u = 0; u < 8; u++) t[o + u] = a[s + u] | l[s + u];
        }
        return (t[o + 8] = i), o;
      }
      function Cu(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function eg(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function bu(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex) return e.parent.injectorIndex;
        let n = 0,
          r = null,
          i = t;
        for (; null !== i; ) {
          if (((r = lg(i)), null === r)) return Ur;
          if ((n++, (i = i[Lr]), -1 !== r.injectorIndex)) return r.injectorIndex | (n << 16);
        }
        return Ur;
      }
      function Su(e, t, n) {
        !(function aS(e, t, n) {
          let r;
          "string" == typeof n ? (r = n.charCodeAt(0) || 0) : n.hasOwnProperty(Vi) && (r = n[Vi]),
            null == r && (r = n[Vi] = sS++);
          const i = r & Xp;
          t.data[e + (i >> Jp)] |= 1 << i;
        })(e, t, n);
      }
      function tg(e, t, n) {
        if (n & F.Optional || void 0 !== e) return e;
        ps();
      }
      function ng(e, t, n, r) {
        if ((n & F.Optional && void 0 === r && (r = null), !(n & (F.Self | F.Host)))) {
          const i = e[kr],
            o = tt(void 0);
          try {
            return i ? i.get(t, r, n & F.Optional) : Jh(t, r, n & F.Optional);
          } finally {
            tt(o);
          }
        }
        return tg(r, 0, n);
      }
      function rg(e, t, n, r = F.Default, i) {
        if (null !== e) {
          if (2048 & t[G] && !(r & F.Self)) {
            const s = (function fS(e, t, n, r, i) {
              let o = e,
                s = t;
              for (; null !== o && null !== s && 2048 & s[G] && !(512 & s[G]); ) {
                const a = ig(o, s, n, r | F.Self, an);
                if (a !== an) return a;
                let l = o.parent;
                if (!l) {
                  const u = s[mp];
                  if (u) {
                    const c = u.get(n, an, r);
                    if (c !== an) return c;
                  }
                  (l = lg(s)), (s = s[Lr]);
                }
                o = l;
              }
              return i;
            })(e, t, n, r, an);
            if (s !== an) return s;
          }
          const o = ig(e, t, n, r, an);
          if (o !== an) return o;
        }
        return ng(t, n, r, i);
      }
      function ig(e, t, n, r, i) {
        const o = (function cS(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(Vi) ? e[Vi] : void 0;
          return "number" == typeof t ? (t >= 0 ? t & Xp : dS) : t;
        })(n);
        if ("function" == typeof o) {
          if (!$p(t, e, r)) return r & F.Host ? tg(i, 0, r) : ng(t, n, r, i);
          try {
            const s = o(r);
            if (null != s || r & F.Optional) return s;
            ps();
          } finally {
            Gp();
          }
        } else if ("number" == typeof o) {
          let s = null,
            a = eg(e, t),
            l = Ur,
            u = r & F.Host ? t[Ce][ze] : null;
          for (
            (-1 === a || r & F.SkipSelf) &&
            ((l = -1 === a ? bu(e, t) : t[a + 8]),
            l !== Ur && sg(r, !1) ? ((s = t[b]), (a = Os(l)), (t = Fs(l, t))) : (a = -1));
            -1 !== a;

          ) {
            const c = t[b];
            if (og(o, a, c.data)) {
              const d = uS(a, t, n, s, r, u);
              if (d !== an) return d;
            }
            (l = t[a + 8]),
              l !== Ur && sg(r, t[b].data[a + 8] === u) && og(o, a, t)
                ? ((s = c), (a = Os(l)), (t = Fs(l, t)))
                : (a = -1);
          }
        }
        return i;
      }
      function uS(e, t, n, r, i, o) {
        const s = t[b],
          a = s.data[e + 8],
          c = (function js(e, t, n, r, i) {
            const o = e.providerIndexes,
              s = t.data,
              a = 1048575 & o,
              l = e.directiveStart,
              c = o >> 20,
              f = i ? a + c : e.directiveEnd;
            for (let h = r ? a : a + c; h < f; h++) {
              const p = s[h];
              if ((h < l && n === p) || (h >= l && p.type === n)) return h;
            }
            if (i) {
              const h = s[l];
              if (h && Ht(h) && h.type === n) return l;
            }
            return null;
          })(a, s, n, null == r ? ar(a) && Eu : r != s && 0 != (3 & a.type), i & F.Host && o === a);
        return null !== c ? dr(t, s, c, a) : an;
      }
      function dr(e, t, n, r) {
        let i = e[n];
        const o = t.data;
        if (
          (function nS(e) {
            return e instanceof Wi;
          })(i)
        ) {
          const s = i;
          s.resolving &&
            (function O0(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new D(-200, `Circular dependency in DI detected for ${e}${n}`);
            })(
              (function ne(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e && null != e && "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : U(e);
              })(o[n])
            );
          const a = ks(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? tt(s.injectImpl) : null;
          $p(e, r, F.Default);
          try {
            (i = e[n] = s.factory(void 0, o, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function eS(e, t, n) {
                  const { ngOnChanges: r, ngOnInit: i, ngDoCheck: o } = t.type.prototype;
                  if (r) {
                    const s = Sp(t);
                    (n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s);
                  }
                  i && (n.preOrderHooks ??= []).push(0 - e, i),
                    o && ((n.preOrderHooks ??= []).push(e, o), (n.preOrderCheckHooks ??= []).push(e, o));
                })(n, o[n], t);
          } finally {
            null !== l && tt(l), ks(a), (s.resolving = !1), Gp();
          }
        }
        return i;
      }
      function og(e, t, n) {
        return !!(n[t + (e >> Jp)] & (1 << e));
      }
      function sg(e, t) {
        return !(e & F.Self || (e & F.Host && t));
      }
      class zr {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return rg(this._tNode, this._lView, t, vs(r), n);
        }
      }
      function dS() {
        return new zr(He(), _());
      }
      function Mu(e) {
        return Zl(e)
          ? () => {
              const t = Mu($(e));
              return t && t();
            }
          : lr(e);
      }
      function lg(e) {
        const t = e[b],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[ze] : null;
      }
      const Gr = "__parameters__";
      function Kr(e, t, n) {
        return Dn(() => {
          const r = (function Tu(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const i in r) this[i] = r[i];
              }
            };
          })(t);
          function i(...o) {
            if (this instanceof i) return r.apply(this, o), this;
            const s = new i(...o);
            return (a.annotation = s), a;
            function a(l, u, c) {
              const d = l.hasOwnProperty(Gr) ? l[Gr] : Object.defineProperty(l, Gr, { value: [] })[Gr];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), l;
            }
          }
          return (
            n && (i.prototype = Object.create(n.prototype)), (i.prototype.ngMetadataName = e), (i.annotationCls = i), i
          );
        });
      }
      function Zi(e, t) {
        e.forEach(n => (Array.isArray(n) ? Zi(n, t) : t(n)));
      }
      function cg(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function Vs(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function mt(e, t, n) {
        let r = Qr(e, t);
        return (
          r >= 0
            ? (e[1 | r] = n)
            : ((r = ~r),
              (function yS(e, t, n, r) {
                let i = e.length;
                if (i == t) e.push(n, r);
                else if (1 === i) e.push(r, e[0]), (e[0] = n);
                else {
                  for (i--, e.push(e[i - 1], e[i]); i > t; ) (e[i] = e[i - 2]), i--;
                  (e[t] = n), (e[t + 1] = r);
                }
              })(e, r, t, n)),
          r
        );
      }
      function Iu(e, t) {
        const n = Qr(e, t);
        if (n >= 0) return e[1 | n];
      }
      function Qr(e, t) {
        return (function dg(e, t, n) {
          let r = 0,
            i = e.length >> n;
          for (; i !== r; ) {
            const o = r + ((i - r) >> 1),
              s = e[o << n];
            if (t === s) return o << n;
            s > t ? (i = o) : (r = o + 1);
          }
          return ~(i << n);
        })(e, t, 1);
      }
      const $s = Bi(Kr("Optional"), 8),
        Us = Bi(Kr("SkipSelf"), 4);
      function Ws(e) {
        return 128 == (128 & e.flags);
      }
      var ut = (() => (
        ((ut = ut || {})[(ut.Important = 1)] = "Important"), (ut[(ut.DashCase = 2)] = "DashCase"), ut
      ))();
      const jS = /^>|^->|<!--|-->|--!>|<!-$/g,
        BS = /(<|>)/,
        VS = "\u200b$1\u200b";
      const Ou = new Map();
      let HS = 0;
      const ku = "__ngContext__";
      function qe(e, t) {
        pt(t)
          ? ((e[ku] = t[zi]),
            (function US(e) {
              Ou.set(e[zi], e);
            })(t))
          : (e[ku] = t);
      }
      let Lu;
      function ju(e, t) {
        return Lu(e, t);
      }
      function eo(e) {
        const t = e[he];
        return ot(t) ? t[he] : t;
      }
      function Bu(e) {
        return Ng(e[$i]);
      }
      function Vu(e) {
        return Ng(e[Vt]);
      }
      function Ng(e) {
        for (; null !== e && !ot(e); ) e = e[Vt];
        return e;
      }
      function Xr(e, t, n, r, i) {
        if (null != r) {
          let o,
            s = !1;
          ot(r) ? (o = r) : pt(r) && ((s = !0), (r = r[Ne]));
          const a = fe(r);
          0 === e && null !== n
            ? null == i
              ? Fg(t, n, a)
              : fr(t, n, a, i || null, !0)
            : 1 === e && null !== n
            ? fr(t, n, a, i || null, !0)
            : 2 === e
            ? (function Js(e, t, n) {
                const r = Ys(e, t);
                r &&
                  (function lM(e, t, n, r) {
                    e.removeChild(t, n, r);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != o &&
              (function dM(e, t, n, r, i) {
                const o = n[nn];
                o !== fe(n) && Xr(t, e, r, o, i);
                for (let a = Ve; a < n.length; a++) {
                  const l = n[a];
                  no(l[b], l, e, t, r, o);
                }
              })(t, e, o, n, i);
        }
      }
      function Hu(e, t) {
        return e.createComment(
          (function Eg(e) {
            return e.replace(jS, t => t.replace(BS, VS));
          })(t)
        );
      }
      function Zs(e, t, n) {
        return e.createElement(t, n);
      }
      function Pg(e, t) {
        const n = e[Br],
          r = n.indexOf(t);
        Pp(t), n.splice(r, 1);
      }
      function $u(e, t) {
        if (e.length <= Ve) return;
        const n = Ve + t,
          r = e[n];
        if (r) {
          const i = r[Ui];
          null !== i && i !== e && Pg(i, r), t > 0 && (e[n - 1][Vt] = r[Vt]);
          const o = Vs(e, Ve + t);
          !(function eM(e, t) {
            no(e, t, t[z], 2, null, null), (t[Ne] = null), (t[ze] = null);
          })(r[b], r);
          const s = o[tn];
          null !== s && s.detachView(o[b]), (r[he] = null), (r[Vt] = null), (r[G] &= -129);
        }
        return r;
      }
      function xg(e, t) {
        if (!(256 & t[G])) {
          const n = t[z];
          t[ws]?.destroy(),
            t[Es]?.destroy(),
            n.destroyNode && no(e, t, n, 3, null, null),
            (function rM(e) {
              let t = e[$i];
              if (!t) return Uu(e[b], e);
              for (; t; ) {
                let n = null;
                if (pt(t)) n = t[$i];
                else {
                  const r = t[Ve];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[Vt] && t !== e; ) pt(t) && Uu(t[b], t), (t = t[he]);
                  null === t && (t = e), pt(t) && Uu(t[b], t), (n = t && t[Vt]);
                }
                t = n;
              }
            })(t);
        }
      }
      function Uu(e, t) {
        if (!(256 & t[G])) {
          (t[G] &= -129),
            (t[G] |= 256),
            (function aM(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const i = t[n[r]];
                  if (!(i instanceof Wi)) {
                    const o = n[r + 1];
                    if (Array.isArray(o))
                      for (let s = 0; s < o.length; s += 2) {
                        const a = i[o[s]],
                          l = o[s + 1];
                        on(4, a, l);
                        try {
                          l.call(a);
                        } finally {
                          on(5, a, l);
                        }
                      }
                    else {
                      on(4, i, o);
                      try {
                        o.call(i);
                      } finally {
                        on(5, i, o);
                      }
                    }
                  }
                }
            })(e, t),
            (function sM(e, t) {
              const n = e.cleanup,
                r = t[Fr];
              if (null !== n)
                for (let o = 0; o < n.length - 1; o += 2)
                  if ("string" == typeof n[o]) {
                    const s = n[o + 3];
                    s >= 0 ? r[s]() : r[-s].unsubscribe(), (o += 2);
                  } else n[o].call(r[n[o + 1]]);
              null !== r && (t[Fr] = null);
              const i = t[Un];
              if (null !== i) {
                t[Un] = null;
                for (let o = 0; o < i.length; o++) (0, i[o])();
              }
            })(e, t),
            1 === t[b].type && t[z].destroy();
          const n = t[Ui];
          if (null !== n && ot(t[he])) {
            n !== t[he] && Pg(n, t);
            const r = t[tn];
            null !== r && r.detachView(e);
          }
          !(function zS(e) {
            Ou.delete(e[zi]);
          })(t);
        }
      }
      function zu(e, t, n) {
        return (function Og(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[Ne];
          {
            const { componentOffset: i } = r;
            if (i > -1) {
              const { encapsulation: o } = e.data[r.directiveStart + i];
              if (o === nt.None || o === nt.Emulated) return null;
            }
            return st(r, n);
          }
        })(e, t.parent, n);
      }
      function fr(e, t, n, r, i) {
        e.insertBefore(t, n, r, i);
      }
      function Fg(e, t, n) {
        e.appendChild(t, n);
      }
      function kg(e, t, n, r, i) {
        null !== r ? fr(e, t, n, r, i) : Fg(e, t, n);
      }
      function Ys(e, t) {
        return e.parentNode(t);
      }
      let qu,
        Qu,
        Bg = function jg(e, t, n) {
          return 40 & e.type ? st(e, n) : null;
        };
      function Xs(e, t, n, r) {
        const i = zu(e, r, t),
          o = t[z],
          a = (function Lg(e, t, n) {
            return Bg(e, t, n);
          })(r.parent || t[ze], r, t);
        if (null != i)
          if (Array.isArray(n)) for (let l = 0; l < n.length; l++) kg(o, i, n[l], a, !1);
          else kg(o, i, n, a, !1);
        void 0 !== qu && qu(o, r, t, n, i);
      }
      function to(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return st(t, e);
          if (4 & n) return Gu(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return to(e, r);
            {
              const i = e[t.index];
              return ot(i) ? Gu(-1, i) : fe(i);
            }
          }
          if (32 & n) return ju(t, e)() || fe(e[t.index]);
          {
            const r = Hg(e, t);
            return null !== r ? (Array.isArray(r) ? r[0] : to(eo(e[Ce]), r)) : to(e, t.next);
          }
        }
        return null;
      }
      function Hg(e, t) {
        return null !== t ? e[Ce][ze].projection[t.projection] : null;
      }
      function Gu(e, t) {
        const n = Ve + e + 1;
        if (n < t.length) {
          const r = t[n],
            i = r[b].firstChild;
          if (null !== i) return to(r, i);
        }
        return t[nn];
      }
      function Wu(e, t, n, r, i, o, s) {
        for (; null != n; ) {
          const a = r[n.index],
            l = n.type;
          if ((s && 0 === t && (a && qe(fe(a), r), (n.flags |= 2)), 32 != (32 & n.flags)))
            if (8 & l) Wu(e, t, n.child, r, i, o, !1), Xr(t, e, i, a, o);
            else if (32 & l) {
              const u = ju(n, r);
              let c;
              for (; (c = u()); ) Xr(t, e, i, c, o);
              Xr(t, e, i, a, o);
            } else 16 & l ? Ug(e, t, r, n, i, o) : Xr(t, e, i, a, o);
          n = s ? n.projectionNext : n.next;
        }
      }
      function no(e, t, n, r, i, o) {
        Wu(n, r, e.firstChild, t, i, o, !1);
      }
      function Ug(e, t, n, r, i, o) {
        const s = n[Ce],
          l = s[ze].projection[r.projection];
        if (Array.isArray(l)) for (let u = 0; u < l.length; u++) Xr(t, e, i, l[u], o);
        else {
          let u = l;
          const c = s[he];
          Ws(r) && (u.flags |= 128), Wu(e, t, u, c, i, o, !0);
        }
      }
      function zg(e, t, n) {
        "" === n ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
      }
      function qg(e, t, n) {
        const { mergedAttrs: r, classes: i, styles: o } = n;
        null !== r && iu(e, t, r),
          null !== i && zg(e, t, i),
          null !== o &&
            (function hM(e, t, n) {
              e.setAttribute(t, "style", n);
            })(e, t, o);
      }
      class Qg {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Kh})`;
        }
      }
      function Gn(e) {
        return e instanceof Qg ? e.changingThisBreaksApplicationSecurity : e;
      }
      const TM = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
      var be = (() => (
        ((be = be || {})[(be.NONE = 0)] = "NONE"),
        (be[(be.HTML = 1)] = "HTML"),
        (be[(be.STYLE = 2)] = "STYLE"),
        (be[(be.SCRIPT = 3)] = "SCRIPT"),
        (be[(be.URL = 4)] = "URL"),
        (be[(be.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        be
      ))();
      function tc(e) {
        const t = (function so() {
          const e = _();
          return e && e[sr].sanitizer;
        })();
        return t
          ? t.sanitize(be.URL, e) || ""
          : (function io(e, t) {
              const n = (function CM(e) {
                return (e instanceof Qg && e.getTypeName()) || null;
              })(e);
              if (null != n && n !== t) {
                if ("ResourceURL" === n && "URL" === t) return !0;
                throw new Error(`Required a safe ${t}, got a ${n} (see ${Kh})`);
              }
              return n === t;
            })(e, "URL")
          ? Gn(e)
          : (function Yu(e) {
              return (e = String(e)).match(TM) ? e : "unsafe:" + e;
            })(U(e));
      }
      class A {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = P({ token: this, providedIn: n.providedIn || "root", factory: n.factory }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const ao = new A("ENVIRONMENT_INITIALIZER"),
        im = new A("INJECTOR", -1),
        om = new A("INJECTOR_DEF_TYPES");
      class sm {
        get(t, n = ji) {
          if (n === ji) {
            const r = new Error(`NullInjectorError: No provider for ${Ae(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function VM(...e) {
        return { ɵproviders: am(0, e), ɵfromNgModule: !0 };
      }
      function am(e, ...t) {
        const n = [],
          r = new Set();
        let i;
        return (
          Zi(t, o => {
            const s = o;
            rc(s, n, [], r) && ((i ||= []), i.push(s));
          }),
          void 0 !== i && lm(i, n),
          n
        );
      }
      function lm(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { providers: i } = e[n];
          ic(i, o => {
            t.push(o);
          });
        }
      }
      function rc(e, t, n, r) {
        if (!(e = $(e))) return !1;
        let i = null,
          o = Zh(e);
        const s = !o && ee(e);
        if (o || s) {
          if (s && !s.standalone) return !1;
          i = e;
        } else {
          const l = e.ngModule;
          if (((o = Zh(l)), !o)) return !1;
          i = l;
        }
        const a = r.has(i);
        if (s) {
          if (a) return !1;
          if ((r.add(i), s.dependencies)) {
            const l = "function" == typeof s.dependencies ? s.dependencies() : s.dependencies;
            for (const u of l) rc(u, t, n, r);
          }
        } else {
          if (!o) return !1;
          {
            if (null != o.imports && !a) {
              let u;
              r.add(i);
              try {
                Zi(o.imports, c => {
                  rc(c, t, n, r) && ((u ||= []), u.push(c));
                });
              } finally {
              }
              void 0 !== u && lm(u, t);
            }
            if (!a) {
              const u = lr(i) || (() => new i());
              t.push(
                { provide: i, useFactory: u, deps: J },
                { provide: om, useValue: i, multi: !0 },
                { provide: ao, useValue: () => M(i), multi: !0 }
              );
            }
            const l = o.providers;
            null == l ||
              a ||
              ic(l, c => {
                t.push(c);
              });
          }
        }
        return i !== e && void 0 !== e.providers;
      }
      function ic(e, t) {
        for (let n of e) Yl(n) && (n = n.ɵproviders), Array.isArray(n) ? ic(n, t) : t(n);
      }
      const HM = ie({ provide: String, useValue: ie });
      function oc(e) {
        return null !== e && "object" == typeof e && HM in e;
      }
      function hr(e) {
        return "function" == typeof e;
      }
      const sc = new A("Set Injector scope."),
        ra = {},
        UM = {};
      let ac;
      function ia() {
        return void 0 === ac && (ac = new sm()), ac;
      }
      class ln {}
      class lc extends ln {
        get destroyed() {
          return this._destroyed;
        }
        constructor(t, n, r, i) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = i),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            cc(t, s => this.processProvider(s)),
            this.records.set(im, ei(void 0, this)),
            i.has("environment") && this.records.set(ln, ei(void 0, this));
          const o = this.records.get(sc);
          null != o && "string" == typeof o.value && this.scopes.add(o.value),
            (this.injectorDefTypes = new Set(this.get(om.multi, J, F.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const n of this._ngOnDestroyHooks) n.ngOnDestroy();
            const t = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (const n of t) n();
          } finally {
            this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear();
          }
        }
        onDestroy(t) {
          return this.assertNotDestroyed(), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t);
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const n = $n(this),
            r = tt(void 0);
          try {
            return t();
          } finally {
            $n(n), tt(r);
          }
        }
        get(t, n = ji, r = F.Default) {
          if ((this.assertNotDestroyed(), t.hasOwnProperty(rp))) return t[rp](this);
          r = vs(r);
          const i = $n(this),
            o = tt(void 0);
          try {
            if (!(r & F.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const l =
                  (function KM(e) {
                    return "function" == typeof e || ("object" == typeof e && e instanceof A);
                  })(t) && gs(t);
                (a = l && this.injectableDefInScope(l) ? ei(uc(t), ra) : null), this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & F.Self ? ia() : this.parent).get(t, (n = r & F.Optional && n === ji ? null : n));
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[ys] = s[ys] || []).unshift(Ae(t)), i)) throw s;
              return (function K0(e, t, n, r) {
                const i = e[ys];
                throw (
                  (t[ep] && i.unshift(t[ep]),
                  (e.message = (function Q0(e, t, n, r = null) {
                    e = e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1) ? e.slice(2) : e;
                    let i = Ae(t);
                    if (Array.isArray(t)) i = t.map(Ae).join(" -> ");
                    else if ("object" == typeof t) {
                      let o = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          o.push(s + ":" + ("string" == typeof a ? JSON.stringify(a) : Ae(a)));
                        }
                      i = `{${o.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${i}]: ${e.replace(U0, "\n  ")}`;
                  })("\n" + e.message, i, n, r)),
                  (e.ngTokenPath = i),
                  (e[ys] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            tt(o), $n(i);
          }
        }
        resolveInjectorInitializers() {
          const t = $n(this),
            n = tt(void 0);
          try {
            const r = this.get(ao.multi, J, F.Self);
            for (const i of r) i();
          } finally {
            $n(t), tt(n);
          }
        }
        toString() {
          const t = [],
            n = this.records;
          for (const r of n.keys()) t.push(Ae(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new D(205, !1);
        }
        processProvider(t) {
          let n = hr((t = $(t))) ? t : $(t && t.provide);
          const r = (function qM(e) {
            return oc(e)
              ? ei(void 0, e.useValue)
              : ei(
                  (function dm(e, t, n) {
                    let r;
                    if (hr(e)) {
                      const i = $(e);
                      return lr(i) || uc(i);
                    }
                    if (oc(e)) r = () => $(e.useValue);
                    else if (
                      (function cm(e) {
                        return !(!e || !e.useFactory);
                      })(e)
                    )
                      r = () => e.useFactory(...tu(e.deps || []));
                    else if (
                      (function um(e) {
                        return !(!e || !e.useExisting);
                      })(e)
                    )
                      r = () => M($(e.useExisting));
                    else {
                      const i = $(e && (e.useClass || e.provide));
                      if (
                        !(function GM(e) {
                          return !!e.deps;
                        })(e)
                      )
                        return lr(i) || uc(i);
                      r = () => new i(...tu(e.deps));
                    }
                    return r;
                  })(e),
                  ra
                );
          })(t);
          if (hr(t) || !0 !== t.multi) this.records.get(n);
          else {
            let i = this.records.get(n);
            i || ((i = ei(void 0, ra, !0)), (i.factory = () => tu(i.multi)), this.records.set(n, i)),
              (n = t),
              i.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === ra && ((n.value = UM), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function WM(e) {
                return null !== e && "object" == typeof e && "function" == typeof e.ngOnDestroy;
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = $(t.providedIn);
          return "string" == typeof n ? "any" === n || this.scopes.has(n) : this.injectorDefTypes.has(n);
        }
        removeOnDestroy(t) {
          const n = this._onDestroyHooks.indexOf(t);
          -1 !== n && this._onDestroyHooks.splice(n, 1);
        }
      }
      function uc(e) {
        const t = gs(e),
          n = null !== t ? t.factory : lr(e);
        if (null !== n) return n;
        if (e instanceof A) throw new D(204, !1);
        if (e instanceof Function)
          return (function zM(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function Yi(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new D(204, !1))
              );
            const n = (function V0(e) {
              return (e && (e[ms] || e[Yh])) || null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new D(204, !1);
      }
      function ei(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function cc(e, t) {
        for (const n of e) Array.isArray(n) ? cc(n, t) : n && Yl(n) ? cc(n.ɵproviders, t) : t(n);
      }
      const oa = new A("AppId", { providedIn: "root", factory: () => QM }),
        QM = "ng",
        fm = new A("Platform Initializer"),
        pr = new A("Platform ID", { providedIn: "platform", factory: () => "unknown" }),
        hm = new A("AnimationModuleType"),
        pm = new A("CSP nonce", {
          providedIn: "root",
          factory: () =>
            (function ro() {
              if (void 0 !== Qu) return Qu;
              if (typeof document < "u") return document;
              throw new D(210, !1);
            })()
              .body?.querySelector("[ngCspNonce]")
              ?.getAttribute("ngCspNonce") || null,
        });
      let mm = (e, t) => null;
      function ym(e, t) {
        return mm(e, t);
      }
      class iT {}
      class _m {}
      class sT {
        resolveComponentFactory(t) {
          throw (function oT(e) {
            const t = Error(`No component factory found for ${Ae(e)}.`);
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let ca = (() => {
        class e {}
        return (e.NULL = new sT()), e;
      })();
      function aT() {
        return ti(He(), _());
      }
      function ti(e, t) {
        return new Wn(st(e, t));
      }
      let Wn = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = aT), e;
      })();
      class fo {}
      let da = (() => {
          class e {}
          return (
            (e.__NG_ELEMENT_ID__ = () =>
              (function uT() {
                const e = _(),
                  n = at(He().index, e);
                return (pt(n) ? n : e)[z];
              })()),
            e
          );
        })(),
        cT = (() => {
          class e {}
          return (e.ɵprov = P({ token: e, providedIn: "root", factory: () => null })), e;
        })();
      class fa {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const dT = new fa("16.0.3"),
        wc = {};
      function ho(e) {
        for (; e; ) {
          e[G] |= 64;
          const t = eo(e);
          if (au(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function Ec(e) {
        return e.ngOriginalError;
      }
      class gr {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t), n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && Ec(t);
          for (; n && Ec(n); ) n = Ec(n);
          return n || null;
        }
      }
      const bm = new A("", { providedIn: "root", factory: () => !1 });
      function Mn(e) {
        return e instanceof Function ? e() : e;
      }
      class Am extends Ep {
        constructor() {
          super(...arguments), (this.consumerAllowSignalWrites = !1), (this._lView = null);
        }
        set lView(t) {
          this._lView = t;
        }
        onConsumerDependencyMayHaveChanged() {
          ho(this._lView);
        }
        onProducerUpdateValueVersion() {}
        get hasReadASignal() {
          return this.hasProducers;
        }
        runInContext(t, n, r) {
          const i = Fe(this);
          this.trackingVersion++;
          try {
            t(n, r);
          } finally {
            Fe(i);
          }
        }
        destroy() {
          this.trackingVersion++;
        }
      }
      let pa = null;
      function Nm() {
        return (pa ??= new Am()), pa;
      }
      function Rm(e, t) {
        return e[t] ?? Nm();
      }
      function Pm(e, t) {
        const n = Nm();
        n.hasReadASignal && ((e[t] = pa), (n.lView = e), (pa = new Am()));
      }
      const q = {};
      function yt(e) {
        xm(Y(), _(), Ze() + e, !1);
      }
      function xm(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[G])) {
            const o = e.preOrderCheckHooks;
            null !== o && Ps(t, o, n);
          } else {
            const o = e.preOrderHooks;
            null !== o && xs(t, o, 0, n);
          }
        cr(n);
      }
      function Lm(e, t = null, n = null, r) {
        const i = jm(e, t, n, r);
        return i.resolveInjectorInitializers(), i;
      }
      function jm(e, t = null, n = null, r, i = new Set()) {
        const o = [n || J, VM(e)];
        return (r = r || ("object" == typeof e ? void 0 : Ae(e))), new lc(o, t || ia(), r || null, i);
      }
      let Tn = (() => {
        class e {
          static create(n, r) {
            if (Array.isArray(n)) return Lm({ name: "" }, r, n, "");
            {
              const i = n.name ?? "";
              return Lm({ name: i }, n.parent, n.providers, i);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = ji),
          (e.NULL = new sm()),
          (e.ɵprov = P({ token: e, providedIn: "any", factory: () => M(im) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function L(e, t = F.Default) {
        const n = _();
        return null === n ? M(e, t) : rg(He(), n, $(e), t);
      }
      function ga(e, t, n, r, i, o, s, a, l, u, c) {
        const d = t.blueprint.slice();
        return (
          (d[Ne] = i),
          (d[G] = 140 | r),
          (null !== u || (e && 2048 & e[G])) && (d[G] |= 2048),
          Rp(d),
          (d[he] = d[Lr] = e),
          (d[ye] = n),
          (d[sr] = s || (e && e[sr])),
          (d[z] = a || (e && e[z])),
          (d[kr] = l || (e && e[kr]) || null),
          (d[ze] = o),
          (d[zi] = (function $S() {
            return HS++;
          })()),
          (d[En] = c),
          (d[mp] = u),
          (d[Ce] = 2 == t.type ? e[Ce] : d),
          d
        );
      }
      function ri(e, t, n, r, i) {
        let o = e.data[t];
        if (null === o)
          (o = (function Cc(e, t, n, r, i) {
            const o = Lp(),
              s = hu(),
              l = (e.data[t] = (function PT(e, t, n, r, i, o) {
                let s = t ? t.injectorIndex : -1,
                  a = 0;
                return (
                  (function Hr() {
                    return null !== V.skipHydrationRootTNode;
                  })() && (a |= 128),
                  {
                    type: n,
                    index: r,
                    insertBeforeIndex: null,
                    injectorIndex: s,
                    directiveStart: -1,
                    directiveEnd: -1,
                    directiveStylingLast: -1,
                    componentOffset: -1,
                    propertyBindings: null,
                    flags: a,
                    providerIndexes: 0,
                    value: i,
                    attrs: o,
                    mergedAttrs: null,
                    localNames: null,
                    initialInputs: void 0,
                    inputs: null,
                    outputs: null,
                    tView: null,
                    next: null,
                    prev: null,
                    projectionNext: null,
                    child: null,
                    parent: t,
                    projection: null,
                    styles: null,
                    stylesWithoutHost: null,
                    residualStyles: void 0,
                    classes: null,
                    classesWithoutHost: null,
                    residualClasses: void 0,
                    classBindings: 0,
                    styleBindings: 0,
                  }
                );
              })(0, s ? o : o && o.parent, n, t, r, i));
            return (
              null === e.firstChild && (e.firstChild = l),
              null !== o &&
                (s
                  ? null == o.child && null !== l.parent && (o.child = l)
                  : null === o.next && ((o.next = l), (l.prev = o))),
              l
            );
          })(e, t, n, r, i)),
            (function Gb() {
              return V.lFrame.inI18n;
            })() && (o.flags |= 32);
        else if (64 & o.type) {
          (o.type = n), (o.value = r), (o.attrs = i);
          const s = (function Gi() {
            const e = V.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          o.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return sn(o, !0), o;
      }
      function po(e, t, n, r) {
        if (0 === n) return -1;
        const i = t.length;
        for (let o = 0; o < n; o++) t.push(r), e.blueprint.push(r), e.data.push(null);
        return i;
      }
      function Vm(e, t, n, r, i) {
        const o = Rm(t, ws),
          s = Ze(),
          a = 2 & r;
        try {
          if ((cr(-1), a && t.length > Z && xm(e, t, Z, !1), on(a ? 2 : 0, i), a)) o.runInContext(n, r, i);
          else {
            const u = Fe(null);
            try {
              n(r, i);
            } finally {
              Fe(u);
            }
          }
        } finally {
          a && null === t[ws] && Pm(t, ws), cr(s), on(a ? 3 : 1, i);
        }
      }
      function bc(e, t, n) {
        if (su(t)) {
          const r = Fe(null);
          try {
            const o = t.directiveEnd;
            for (let s = t.directiveStart; s < o; s++) {
              const a = e.data[s];
              a.contentQueries && a.contentQueries(1, n[s], s);
            }
          } finally {
            Fe(r);
          }
        }
      }
      function Sc(e, t, n) {
        kp() &&
          ((function BT(e, t, n, r) {
            const i = n.directiveStart,
              o = n.directiveEnd;
            ar(n) &&
              (function GT(e, t, n) {
                const r = st(t, e),
                  s = ma(
                    e,
                    ga(
                      e,
                      Hm(n),
                      null,
                      n.onPush ? 64 : 16,
                      r,
                      t,
                      null,
                      e[sr].rendererFactory.createRenderer(r, n),
                      null,
                      null,
                      null
                    )
                  );
                e[t.index] = s;
              })(t, n, e.data[i + n.componentOffset]),
              e.firstCreatePass || Ls(n, t),
              qe(r, t);
            const s = n.initialInputs;
            for (let a = i; a < o; a++) {
              const l = e.data[a],
                u = dr(t, e, a, n);
              qe(u, t), null !== s && WT(0, a - i, u, l, 0, s), Ht(l) && (at(n.index, t)[ye] = dr(t, e, a, n));
            }
          })(e, t, n, st(n, t)),
          64 == (64 & n.flags) && Gm(e, t, n));
      }
      function Mc(e, t, n = st) {
        const r = t.localNames;
        if (null !== r) {
          let i = t.index + 1;
          for (let o = 0; o < r.length; o += 2) {
            const s = r[o + 1],
              a = -1 === s ? n(t, e) : e[s];
            e[i++] = a;
          }
        }
      }
      function Hm(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = Tc(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts,
              e.id
            ))
          : t;
      }
      function Tc(e, t, n, r, i, o, s, a, l, u, c) {
        const d = Z + r,
          f = d + i,
          h = (function MT(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : q);
            return n;
          })(d, f),
          p = "function" == typeof u ? u() : u;
        return (h[b] = {
          type: e,
          blueprint: h,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: h.slice().fill(null, d),
          bindingStartIndex: d,
          expandoStartIndex: f,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof o ? o() : o,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: l,
          consts: p,
          incompleteFirstPass: !1,
          ssrId: c,
        });
      }
      let $m = e => null;
      function Um(e, t, n, r) {
        for (let i in e)
          if (e.hasOwnProperty(i)) {
            n = null === n ? {} : n;
            const o = e[i];
            null === r ? zm(n, t, i, o) : r.hasOwnProperty(i) && zm(n, t, r[i], o);
          }
        return n;
      }
      function zm(e, t, n, r) {
        e.hasOwnProperty(n) ? e[n].push(t, r) : (e[n] = [t, r]);
      }
      function Ic(e, t, n, r) {
        if (kp()) {
          const i = null === r ? null : { "": -1 },
            o = (function HT(e, t) {
              const n = e.directiveRegistry;
              let r = null,
                i = null;
              if (n)
                for (let o = 0; o < n.length; o++) {
                  const s = n[o];
                  if (cp(t, s.selectors, !1))
                    if ((r || (r = []), Ht(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (i = i || new Map()), s.findHostDirectiveDefs(s, a, i), r.unshift(...a, s), Ac(e, t, a.length);
                      } else r.unshift(s), Ac(e, t, 0);
                    else (i = i || new Map()), s.findHostDirectiveDefs?.(s, r, i), r.push(s);
                }
              return null === r ? null : [r, i];
            })(e, n);
          let s, a;
          null === o ? (s = a = null) : ([s, a] = o),
            null !== s && qm(e, t, n, s, i, a),
            i &&
              (function $T(e, t, n) {
                if (t) {
                  const r = (e.localNames = []);
                  for (let i = 0; i < t.length; i += 2) {
                    const o = n[t[i + 1]];
                    if (null == o) throw new D(-301, !1);
                    r.push(t[i], o);
                  }
                }
              })(n, r, i);
        }
        n.mergedAttrs = Hi(n.mergedAttrs, n.attrs);
      }
      function qm(e, t, n, r, i, o) {
        for (let u = 0; u < r.length; u++) Su(Ls(n, t), e, r[u].type);
        !(function zT(e, t, n) {
          (e.flags |= 1), (e.directiveStart = t), (e.directiveEnd = t + n), (e.providerIndexes = t);
        })(n, e.data.length, r.length);
        for (let u = 0; u < r.length; u++) {
          const c = r[u];
          c.providersResolver && c.providersResolver(c);
        }
        let s = !1,
          a = !1,
          l = po(e, t, r.length, null);
        for (let u = 0; u < r.length; u++) {
          const c = r[u];
          (n.mergedAttrs = Hi(n.mergedAttrs, c.hostAttrs)),
            qT(e, n, t, l, c),
            UT(l, c, i),
            null !== c.contentQueries && (n.flags |= 4),
            (null !== c.hostBindings || null !== c.hostAttrs || 0 !== c.hostVars) && (n.flags |= 64);
          const d = c.type.prototype;
          !s && (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) && ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
            !a && (d.ngOnChanges || d.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
            l++;
        }
        !(function xT(e, t, n) {
          const i = t.directiveEnd,
            o = e.data,
            s = t.attrs,
            a = [];
          let l = null,
            u = null;
          for (let c = t.directiveStart; c < i; c++) {
            const d = o[c],
              f = n ? n.get(d) : null,
              p = f ? f.outputs : null;
            (l = Um(d.inputs, c, l, f ? f.inputs : null)), (u = Um(d.outputs, c, u, p));
            const g = null === l || null === s || up(t) ? null : KT(l, c, s);
            a.push(g);
          }
          null !== l && (l.hasOwnProperty("class") && (t.flags |= 8), l.hasOwnProperty("style") && (t.flags |= 16)),
            (t.initialInputs = a),
            (t.inputs = l),
            (t.outputs = u);
        })(e, n, o);
      }
      function Gm(e, t, n) {
        const r = n.directiveStart,
          i = n.directiveEnd,
          o = n.index,
          s = (function Kb() {
            return V.lFrame.currentDirectiveIndex;
          })();
        try {
          cr(o);
          for (let a = r; a < i; a++) {
            const l = e.data[a],
              u = t[a];
            gu(a), (null !== l.hostBindings || 0 !== l.hostVars || null !== l.hostAttrs) && VT(l, u);
          }
        } finally {
          cr(-1), gu(s);
        }
      }
      function VT(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Ac(e, t, n) {
        (t.componentOffset = n), (e.components ??= []).push(t.index);
      }
      function UT(e, t, n) {
        if (n) {
          if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          Ht(t) && (n[""] = e);
        }
      }
      function qT(e, t, n, r, i) {
        e.data[r] = i;
        const o = i.factory || (i.factory = lr(i.type)),
          s = new Wi(o, Ht(i), L);
        (e.blueprint[r] = s),
          (n[r] = s),
          (function LT(e, t, n, r, i) {
            const o = i.hostBindings;
            if (o) {
              let s = e.hostBindingOpCodes;
              null === s && (s = e.hostBindingOpCodes = []);
              const a = ~t.index;
              (function jT(e) {
                let t = e.length;
                for (; t > 0; ) {
                  const n = e[--t];
                  if ("number" == typeof n && n < 0) return n;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(n, r, o);
            }
          })(e, t, r, po(e, n, i.hostVars, q), i);
      }
      function WT(e, t, n, r, i, o) {
        const s = o[t];
        if (null !== s) for (let a = 0; a < s.length; ) Wm(r, n, s[a++], s[a++], s[a++]);
      }
      function Wm(e, t, n, r, i) {
        const o = Fe(null);
        try {
          null !== e.setInput ? e.setInput(t, i, n, r) : (t[r] = i);
        } finally {
          Fe(o);
        }
      }
      function KT(e, t, n) {
        let r = null,
          i = 0;
        for (; i < n.length; ) {
          const o = n[i];
          if (0 !== o)
            if (5 !== o) {
              if ("number" == typeof o) break;
              if (e.hasOwnProperty(o)) {
                null === r && (r = []);
                const s = e[o];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === t) {
                    r.push(o, s[a + 1], n[i + 1]);
                    break;
                  }
              }
              i += 2;
            } else i += 2;
          else i += 4;
        }
        return r;
      }
      function Km(e, t, n, r) {
        return [e, !0, !1, t, null, 0, r, n, null, null, null];
      }
      function Qm(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const o = n[r + 1];
            if (-1 !== o) {
              const s = e.data[o];
              yu(n[r]), s.contentQueries(2, t[o], o);
            }
          }
      }
      function ma(e, t) {
        return e[$i] ? (e[gp][Vt] = t) : (e[$i] = t), (e[gp] = t), t;
      }
      function Rc(e, t, n) {
        yu(0);
        const r = Fe(null);
        try {
          t(e, n);
        } finally {
          Fe(r);
        }
      }
      function Pc(e, t, n, r, i) {
        for (let o = 0; o < n.length; ) {
          const s = n[o++],
            a = n[o++];
          Wm(e.data[s], t[s], r, a, i);
        }
      }
      function QT(e, t) {
        const n = at(t, e),
          r = n[b];
        !(function ZT(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
        })(r, n);
        const i = n[Ne];
        null !== i && null === n[En] && (n[En] = ym(i, n[kr])), xc(r, n, n[ye]);
      }
      function xc(e, t, n) {
        vu(t);
        try {
          const r = e.viewQuery;
          null !== r && Rc(1, r, n);
          const i = e.template;
          null !== i && Vm(e, t, i, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && Qm(e, t),
            e.staticViewQueries && Rc(2, e.viewQuery, n);
          const o = e.components;
          null !== o &&
            (function YT(e, t) {
              for (let n = 0; n < t.length; n++) QT(e, t[n]);
            })(t, o);
        } catch (r) {
          throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), r);
        } finally {
          (t[G] &= -5), Du();
        }
      }
      let ey = (() => {
        class e {
          constructor() {
            (this.all = new Set()), (this.queue = new Map());
          }
          create(n, r, i) {
            const o = typeof Zone > "u" ? null : Zone.current,
              s = new Cb(
                n,
                u => {
                  this.all.has(u) && this.queue.set(u, o);
                },
                i
              );
            let a;
            this.all.add(s), s.notify();
            const l = () => {
              s.cleanup(), a?.(), this.all.delete(s), this.queue.delete(s);
            };
            return (a = r?.onDestroy(l)), { destroy: l };
          }
          flush() {
            if (0 !== this.queue.size)
              for (const [n, r] of this.queue) this.queue.delete(n), r ? r.run(() => n.run()) : n.run();
          }
          get isQueueEmpty() {
            return 0 === this.queue.size;
          }
        }
        return (e.ɵprov = P({ token: e, providedIn: "root", factory: () => new e() })), e;
      })();
      function ya(e, t, n) {
        let r = n ? e.styles : null,
          i = n ? e.classes : null,
          o = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a ? (o = a) : 1 == o ? (i = Kl(i, a)) : 2 == o && (r = Kl(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r), n ? (e.classes = i) : (e.classesWithoutHost = i);
      }
      function go(e, t, n, r, i = !1) {
        for (; null !== n; ) {
          const o = t[n.index];
          if ((null !== o && r.push(fe(o)), ot(o))) {
            for (let a = Ve; a < o.length; a++) {
              const l = o[a],
                u = l[b].firstChild;
              null !== u && go(l[b], l, u, r);
            }
            o[nn] !== o[Ne] && r.push(o[nn]);
          }
          const s = n.type;
          if (8 & s) go(e, t, n.child, r);
          else if (32 & s) {
            const a = ju(n, t);
            let l;
            for (; (l = a()); ) r.push(l);
          } else if (16 & s) {
            const a = Hg(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = eo(t[Ce]);
              go(l[b], l, a, r, !0);
            }
          }
          n = i ? n.projectionNext : n.next;
        }
        return r;
      }
      function va(e, t, n, r = !0) {
        const i = t[sr].rendererFactory;
        i.begin && i.begin();
        try {
          Da(e, t, e.template, n);
        } catch (s) {
          throw (
            (r &&
              (function Jm(e, t) {
                const n = e[kr],
                  r = n ? n.get(gr, null) : null;
                r && r.handleError(t);
              })(t, s),
            s)
          );
        } finally {
          i.end && i.end(), t[sr].effectManager?.flush();
        }
      }
      function Da(e, t, n, r) {
        const i = t[G];
        if (256 != (256 & i)) {
          t[sr].effectManager?.flush(), vu(t);
          try {
            Rp(t),
              (function Bp(e) {
                return (V.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && Vm(e, t, n, 2, r);
            const s = 3 == (3 & i);
            if (s) {
              const u = e.preOrderCheckHooks;
              null !== u && Ps(t, u, null);
            } else {
              const u = e.preOrderHooks;
              null !== u && xs(t, u, 0, null), _u(t, 0);
            }
            if (
              ((function rI(e) {
                for (let t = Bu(e); null !== t; t = Vu(t)) {
                  if (!t[yp]) continue;
                  const n = t[Br];
                  for (let r = 0; r < n.length; r++) {
                    xb(n[r]);
                  }
                }
              })(t),
              (function nI(e) {
                for (let t = Bu(e); null !== t; t = Vu(t))
                  for (let n = Ve; n < t.length; n++) {
                    const r = t[n],
                      i = r[b];
                    As(r) && Da(i, r, i.template, r[ye]);
                  }
              })(t),
              null !== e.contentQueries && Qm(e, t),
              s)
            ) {
              const u = e.contentCheckHooks;
              null !== u && Ps(t, u);
            } else {
              const u = e.contentHooks;
              null !== u && xs(t, u, 1), _u(t, 1);
            }
            !(function ST(e, t) {
              const n = e.hostBindingOpCodes;
              if (null === n) return;
              const r = Rm(t, Es);
              try {
                for (let i = 0; i < n.length; i++) {
                  const o = n[i];
                  if (o < 0) cr(~o);
                  else {
                    const s = o,
                      a = n[++i],
                      l = n[++i];
                    Wb(a, s), r.runInContext(l, 2, t[s]);
                  }
                }
              } finally {
                null === t[Es] && Pm(t, Es), cr(-1);
              }
            })(e, t);
            const a = e.components;
            null !== a &&
              (function oI(e, t) {
                for (let n = 0; n < t.length; n++) iI(e, t[n]);
              })(t, a);
            const l = e.viewQuery;
            if ((null !== l && Rc(2, l, r), s)) {
              const u = e.viewCheckHooks;
              null !== u && Ps(t, u);
            } else {
              const u = e.viewHooks;
              null !== u && xs(t, u, 2), _u(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1), (t[G] &= -73), Pp(t);
          } finally {
            Du();
          }
        }
      }
      function iI(e, t) {
        const n = at(t, e);
        if (As(n)) {
          const r = n[b];
          80 & n[G] ? Da(r, n, r.template, n[ye]) : n[or] > 0 && Oc(n);
        }
      }
      function Oc(e) {
        for (let r = Bu(e); null !== r; r = Vu(r))
          for (let i = Ve; i < r.length; i++) {
            const o = r[i];
            if (As(o))
              if (1024 & o[G]) {
                const s = o[b];
                Da(s, o, s.template, o[ye]);
              } else o[or] > 0 && Oc(o);
          }
        const n = e[b].components;
        if (null !== n)
          for (let r = 0; r < n.length; r++) {
            const i = at(n[r], e);
            As(i) && i[or] > 0 && Oc(i);
          }
      }
      class mo {
        get rootNodes() {
          const t = this._lView,
            n = t[b];
          return go(n, t, n.firstChild, []);
        }
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[ye];
        }
        set context(t) {
          this._lView[ye] = t;
        }
        get destroyed() {
          return 256 == (256 & this._lView[G]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[he];
            if (ot(t)) {
              const n = t[Cs],
                r = n ? n.indexOf(this) : -1;
              r > -1 && ($u(t, r), Vs(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          xg(this._lView[b], this._lView);
        }
        onDestroy(t) {
          !(function Op(e, t) {
            if (256 == (256 & e[G])) throw new D(911, !1);
            null === e[Un] && (e[Un] = []), e[Un].push(t);
          })(this._lView, t);
        }
        markForCheck() {
          ho(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[G] &= -129;
        }
        reattach() {
          this._lView[G] |= 128;
        }
        detectChanges() {
          va(this._lView[b], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new D(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function nM(e, t) {
              no(e, t, t[z], 2, null, null);
            })(this._lView[b], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new D(902, !1);
          this._appRef = t;
        }
      }
      class sI extends mo {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          va(t[b], t, t[ye], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class ty extends ca {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = ee(t);
          return new yo(n, this.ngModule);
        }
      }
      function ny(e) {
        const t = [];
        for (let n in e) e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class lI {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          r = vs(r);
          const i = this.injector.get(t, wc, r);
          return i !== wc || n === wc ? i : this.parentInjector.get(t, n, r);
        }
      }
      class yo extends _m {
        get inputs() {
          return ny(this.componentDef.inputs);
        }
        get outputs() {
          return ny(this.componentDef.outputs);
        }
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function ob(e) {
              return e.map(ib).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors ? t.ngContentSelectors : []),
            (this.isBoundToModule = !!n);
        }
        create(t, n, r, i) {
          let o = (i = i || this.ngModule) instanceof ln ? i : i?.injector;
          o &&
            null !== this.componentDef.getStandaloneInjector &&
            (o = this.componentDef.getStandaloneInjector(o) || o);
          const s = o ? new lI(t, o) : t,
            a = s.get(fo, null);
          if (null === a) throw new D(407, !1);
          const c = { rendererFactory: a, sanitizer: s.get(cT, null), effectManager: s.get(ey, null) },
            d = a.createRenderer(null, this.componentDef),
            f = this.componentDef.selectors[0][0] || "div",
            h = r
              ? (function TT(e, t, n, r) {
                  const o = r.get(bm, !1) || n === nt.ShadowDom,
                    s = e.selectRootElement(t, o);
                  return (
                    (function IT(e) {
                      $m(e);
                    })(s),
                    s
                  );
                })(d, r, this.componentDef.encapsulation, s)
              : Zs(
                  d,
                  f,
                  (function aI(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? Ip : "math" === t ? "math" : null;
                  })(f)
                ),
            p = this.componentDef.onPush ? 576 : 528,
            g = Tc(0, null, null, 1, 0, null, null, null, null, null, null),
            y = ga(null, g, null, p, null, null, c, d, s, null, null);
          let v, m;
          vu(y);
          try {
            const C = this.componentDef;
            let T,
              x = null;
            C.findHostDirectiveDefs
              ? ((T = []), (x = new Map()), C.findHostDirectiveDefs(C, T, x), T.push(C))
              : (T = [C]);
            const de = (function cI(e, t) {
                const n = e[b],
                  r = Z;
                return (e[r] = t), ri(n, r, 2, "#host", null);
              })(y, h),
              Ie = (function dI(e, t, n, r, i, o, s) {
                const a = i[b];
                !(function fI(e, t, n, r) {
                  for (const i of e) t.mergedAttrs = Hi(t.mergedAttrs, i.hostAttrs);
                  null !== t.mergedAttrs && (ya(t, t.mergedAttrs, !0), null !== n && qg(r, n, t));
                })(r, e, t, s);
                let l = null;
                null !== t && (l = ym(t, i[kr]));
                const u = o.rendererFactory.createRenderer(t, n),
                  c = ga(i, Hm(n), null, n.onPush ? 64 : 16, i[e.index], e, o, u, null, null, l);
                return a.firstCreatePass && Ac(a, e, r.length - 1), ma(i, c), (i[e.index] = c);
              })(de, h, C, T, y, c, d);
            (m = Np(g, Z)),
              h &&
                (function pI(e, t, n, r) {
                  if (r) iu(e, n, ["ng-version", dT.full]);
                  else {
                    const { attrs: i, classes: o } = (function sb(e) {
                      const t = [],
                        n = [];
                      let r = 1,
                        i = 2;
                      for (; r < e.length; ) {
                        let o = e[r];
                        if ("string" == typeof o) 2 === i ? "" !== o && t.push(o, e[++r]) : 8 === i && n.push(o);
                        else {
                          if (!Bt(i)) break;
                          i = o;
                        }
                        r++;
                      }
                      return { attrs: t, classes: n };
                    })(t.selectors[0]);
                    i && iu(e, n, i), o && o.length > 0 && zg(e, n, o.join(" "));
                  }
                })(d, C, h, r),
              void 0 !== n &&
                (function gI(e, t, n) {
                  const r = (e.projection = []);
                  for (let i = 0; i < t.length; i++) {
                    const o = n[i];
                    r.push(null != o ? Array.from(o) : null);
                  }
                })(m, this.ngContentSelectors, n),
              (v = (function hI(e, t, n, r, i, o) {
                const s = He(),
                  a = i[b],
                  l = st(s, i);
                qm(a, i, s, n, null, r);
                for (let c = 0; c < n.length; c++) qe(dr(i, a, s.directiveStart + c, s), i);
                Gm(a, i, s), l && qe(l, i);
                const u = dr(i, a, s.directiveStart + s.componentOffset, s);
                if (((e[ye] = i[ye] = u), null !== o)) for (const c of o) c(u, t);
                return bc(a, s, e), u;
              })(Ie, C, T, x, y, [mI])),
              xc(g, y, null);
          } finally {
            Du();
          }
          return new uI(this.componentType, v, ti(m, y), y, m);
        }
      }
      class uI extends iT {
        constructor(t, n, r, i, o) {
          super(),
            (this.location = r),
            (this._rootLView = i),
            (this._tNode = o),
            (this.previousInputValues = null),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new sI(i)),
            (this.componentType = t);
        }
        setInput(t, n) {
          const r = this._tNode.inputs;
          let i;
          if (null !== r && (i = r[t])) {
            if (
              ((this.previousInputValues ??= new Map()),
              this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n))
            )
              return;
            const o = this._rootLView;
            Pc(o[b], o, i, t, n), this.previousInputValues.set(t, n), ho(at(this._tNode.index, o));
          }
        }
        get injector() {
          return new zr(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function mI() {
        const e = He();
        Rs(_()[b], e);
      }
      function _a(e) {
        return !!kc(e) && (Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e));
      }
      function kc(e) {
        return null !== e && ("function" == typeof e || "object" == typeof e);
      }
      function cn(e, t, n) {
        return (e[t] = n);
      }
      function Ge(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function Dt(e, t, n, r, i, o, s, a) {
        const l = _(),
          u = Y(),
          c = e + Z,
          d = u.firstCreatePass
            ? (function qI(e, t, n, r, i, o, s, a, l) {
                const u = t.consts,
                  c = ri(t, e, 4, s || null, zn(u, a));
                Ic(t, n, c, zn(u, l)), Rs(t, c);
                const d = (c.tView = Tc(2, c, r, i, o, t.directiveRegistry, t.pipeRegistry, null, t.schemas, u, null));
                return null !== t.queries && (t.queries.template(t, c), (d.queries = t.queries.embeddedTView(c))), c;
              })(c, u, l, t, n, r, i, o, s)
            : u.data[c];
        sn(d, !1);
        const f = _y(u, l, d, e);
        Ns() && Xs(u, l, f, d),
          qe(f, l),
          ma(l, (l[c] = Km(f, l, f, d))),
          bs(d) && Sc(u, l, d),
          null != s && Mc(l, d, a);
      }
      let _y = function wy(e, t, n, r) {
        return qn(!0), t[z].createComment("");
      };
      function Eo(e) {
        return Vr(
          (function qb() {
            return V.lFrame.contextLView;
          })(),
          Z + e
        );
      }
      function At(e, t, n) {
        const r = _();
        return (
          Ge(r, $r(), t) &&
            (function vt(e, t, n, r, i, o, s, a) {
              const l = st(t, n);
              let c,
                u = t.inputs;
              !a && null != u && (c = u[r])
                ? (Pc(e, n, c, r, i),
                  ar(t) &&
                    (function FT(e, t) {
                      const n = at(t, e);
                      16 & n[G] || (n[G] |= 64);
                    })(n, t.index))
                : 3 & t.type &&
                  ((r = (function OT(e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(r)),
                  (i = null != s ? s(i, t.value || "", r) : i),
                  o.setProperty(l, r, i));
            })(
              Y(),
              (function pe() {
                const e = V.lFrame;
                return Np(e.tView, e.selectedIndex);
              })(),
              r,
              e,
              t,
              r[z],
              n,
              !1
            ),
          At
        );
      }
      function Uc(e, t, n, r, i) {
        const s = i ? "class" : "style";
        Pc(e, n, t.inputs[s], s, r);
      }
      function w(e, t, n, r) {
        const i = _(),
          o = Y(),
          s = Z + e,
          a = i[z],
          l = o.firstCreatePass
            ? (function QI(e, t, n, r, i, o) {
                const s = t.consts,
                  l = ri(t, e, 2, r, zn(s, i));
                return (
                  Ic(t, n, l, zn(s, o)),
                  null !== l.attrs && ya(l, l.attrs, !1),
                  null !== l.mergedAttrs && ya(l, l.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, l),
                  l
                );
              })(s, o, i, t, n, r)
            : o.data[s],
          u = Ey(o, i, l, a, t, e);
        i[s] = u;
        const c = bs(l);
        return (
          sn(l, !0),
          qg(a, u, l),
          32 != (32 & l.flags) && Ns() && Xs(o, i, u, l),
          0 ===
            (function Fb() {
              return V.lFrame.elementDepthCount;
            })() && qe(u, i),
          (function kb() {
            V.lFrame.elementDepthCount++;
          })(),
          c && (Sc(o, i, l), bc(o, l, i)),
          null !== r && Mc(i, l),
          w
        );
      }
      function E() {
        let e = He();
        hu() ? pu() : ((e = e.parent), sn(e, !1));
        const t = e;
        (function jb(e) {
          return V.skipHydrationRootTNode === e;
        })(t) &&
          (function $b() {
            V.skipHydrationRootTNode = null;
          })(),
          (function Lb() {
            V.lFrame.elementDepthCount--;
          })();
        const n = Y();
        return (
          n.firstCreatePass && (Rs(n, e), su(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function rS(e) {
              return 0 != (8 & e.flags);
            })(t) &&
            Uc(n, t, _(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function iS(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            Uc(n, t, _(), t.stylesWithoutHost, !1),
          E
        );
      }
      function ae(e, t, n, r) {
        return w(e, t, n, r), E(), ae;
      }
      let Ey = (e, t, n, r, i, o) => (
        qn(!0),
        Zs(
          r,
          i,
          (function Wp() {
            return V.lFrame.currentNamespace;
          })()
        )
      );
      function Sa(e, t, n) {
        const r = _(),
          i = Y(),
          o = e + Z,
          s = i.firstCreatePass
            ? (function XI(e, t, n, r, i) {
                const o = t.consts,
                  s = zn(o, r),
                  a = ri(t, e, 8, "ng-container", s);
                return (
                  null !== s && ya(a, s, !0),
                  Ic(t, n, a, zn(o, i)),
                  null !== t.queries && t.queries.elementStart(t, a),
                  a
                );
              })(o, i, r, t, n)
            : i.data[o];
        sn(s, !0);
        const a = Cy(i, r, s, e);
        return (
          (r[o] = a), Ns() && Xs(i, r, a, s), qe(a, r), bs(s) && (Sc(i, r, s), bc(i, s, r)), null != n && Mc(r, s), Sa
        );
      }
      function Ma() {
        let e = He();
        const t = Y();
        return (
          hu() ? pu() : ((e = e.parent), sn(e, !1)),
          t.firstCreatePass && (Rs(t, e), su(e) && t.queries.elementEnd(e)),
          Ma
        );
      }
      function zc(e, t, n) {
        return Sa(e, t, n), Ma(), zc;
      }
      let Cy = (e, t, n, r) => (qn(!0), Hu(t[z], ""));
      function Ta(e) {
        return !!e && "function" == typeof e.then;
      }
      function by(e) {
        return !!e && "function" == typeof e.subscribe;
      }
      function hi(e = 1) {
        return (function Zb(e) {
          return (V.lFrame.contextLView = (function Yb(e, t) {
            for (; e > 0; ) (t = t[Lr]), e--;
            return t;
          })(e, V.lFrame.contextLView))[ye];
        })(e);
      }
      function Ia(e, t) {
        return (e << 17) | (t << 2);
      }
      function Kn(e) {
        return (e >> 17) & 32767;
      }
      function Wc(e) {
        return 2 | e;
      }
      function yr(e) {
        return (131068 & e) >> 2;
      }
      function Kc(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function Qc(e) {
        return 1 | e;
      }
      function jy(e, t, n, r, i) {
        const o = e[n + 1],
          s = null === t;
        let a = r ? Kn(o) : yr(o),
          l = !1;
        for (; 0 !== a && (!1 === l || s); ) {
          const c = e[a + 1];
          dA(e[a], t) && ((l = !0), (e[a + 1] = r ? Qc(c) : Wc(c))), (a = r ? Kn(c) : yr(c));
        }
        l && (e[n + 1] = r ? Wc(o) : Qc(o));
      }
      function dA(e, t) {
        return (
          null === e ||
          null == t ||
          (Array.isArray(e) ? e[1] : e) === t ||
          (!(!Array.isArray(e) || "string" != typeof t) && Qr(e, t) >= 0)
        );
      }
      const Pe = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
      function By(e) {
        return e.substring(Pe.key, Pe.keyEnd);
      }
      function fA(e) {
        return e.substring(Pe.value, Pe.valueEnd);
      }
      function Hy(e, t) {
        const n = Pe.textEnd;
        let r = (Pe.key = pi(e, t, n));
        return n === r
          ? -1
          : ((r = Pe.keyEnd =
              (function mA(e, t, n) {
                let r;
                for (
                  ;
                  t < n &&
                  (45 === (r = e.charCodeAt(t)) ||
                    95 === r ||
                    ((-33 & r) >= 65 && (-33 & r) <= 90) ||
                    (r >= 48 && r <= 57));

                )
                  t++;
                return t;
              })(e, r, n)),
            (r = Uy(e, r, n)),
            (r = Pe.value = pi(e, r, n)),
            (r = Pe.valueEnd =
              (function yA(e, t, n) {
                let r = -1,
                  i = -1,
                  o = -1,
                  s = t,
                  a = s;
                for (; s < n; ) {
                  const l = e.charCodeAt(s++);
                  if (59 === l) return a;
                  34 === l || 39 === l
                    ? (a = s = zy(e, l, s, n))
                    : t === s - 4 && 85 === o && 82 === i && 76 === r && 40 === l
                    ? (a = s = zy(e, 41, s, n))
                    : l > 32 && (a = s),
                    (o = i),
                    (i = r),
                    (r = -33 & l);
                }
                return a;
              })(e, r, n)),
            Uy(e, r, n));
      }
      function pi(e, t, n) {
        for (; t < n && e.charCodeAt(t) <= 32; ) t++;
        return t;
      }
      function Uy(e, t, n, r) {
        return (t = pi(e, t, n)) < n && t++, t;
      }
      function zy(e, t, n, r) {
        let i = -1,
          o = n;
        for (; o < r; ) {
          const s = e.charCodeAt(o++);
          if (s == t && 92 !== i) return o;
          i = 92 == s && 92 === i ? 0 : s;
        }
        throw new Error();
      }
      function Nt(e) {
        !(function Ut(e, t, n, r) {
          const i = Y(),
            o = (function bn(e) {
              const t = V.lFrame,
                n = t.bindingIndex;
              return (t.bindingIndex = t.bindingIndex + e), n;
            })(2);
          i.firstUpdatePass &&
            (function Ky(e, t, n, r) {
              const i = e.data;
              if (null === i[n + 1]) {
                const o = i[Ze()],
                  s = Wy(e, n);
                Xy(o, r) && null === t && !s && (t = !1),
                  (t = (function _A(e, t, n, r) {
                    const i = (function mu(e) {
                      const t = V.lFrame.currentDirectiveIndex;
                      return -1 === t ? null : e[t];
                    })(e);
                    let o = r ? t.residualClasses : t.residualStyles;
                    if (null === i)
                      0 === (r ? t.classBindings : t.styleBindings) &&
                        ((n = Co((n = Zc(null, e, t, n, r)), t.attrs, r)), (o = null));
                    else {
                      const s = t.directiveStylingLast;
                      if (-1 === s || e[s] !== i)
                        if (((n = Zc(i, e, t, n, r)), null === o)) {
                          let l = (function wA(e, t, n) {
                            const r = n ? t.classBindings : t.styleBindings;
                            if (0 !== yr(r)) return e[Kn(r)];
                          })(e, t, r);
                          void 0 !== l &&
                            Array.isArray(l) &&
                            ((l = Zc(null, e, t, l[1], r)),
                            (l = Co(l, t.attrs, r)),
                            (function EA(e, t, n, r) {
                              e[Kn(n ? t.classBindings : t.styleBindings)] = r;
                            })(e, t, r, l));
                        } else
                          o = (function CA(e, t, n) {
                            let r;
                            const i = t.directiveEnd;
                            for (let o = 1 + t.directiveStylingLast; o < i; o++) r = Co(r, e[o].hostAttrs, n);
                            return Co(r, t.attrs, n);
                          })(e, t, r);
                    }
                    return void 0 !== o && (r ? (t.residualClasses = o) : (t.residualStyles = o)), n;
                  })(i, o, t, r)),
                  (function uA(e, t, n, r, i, o) {
                    let s = o ? t.classBindings : t.styleBindings,
                      a = Kn(s),
                      l = yr(s);
                    e[r] = n;
                    let c,
                      u = !1;
                    if ((Array.isArray(n) ? ((c = n[1]), (null === c || Qr(n, c) > 0) && (u = !0)) : (c = n), i))
                      if (0 !== l) {
                        const f = Kn(e[a + 1]);
                        (e[r + 1] = Ia(f, a)),
                          0 !== f && (e[f + 1] = Kc(e[f + 1], r)),
                          (e[a + 1] = (function aA(e, t) {
                            return (131071 & e) | (t << 17);
                          })(e[a + 1], r));
                      } else (e[r + 1] = Ia(a, 0)), 0 !== a && (e[a + 1] = Kc(e[a + 1], r)), (a = r);
                    else (e[r + 1] = Ia(l, 0)), 0 === a ? (a = r) : (e[l + 1] = Kc(e[l + 1], r)), (l = r);
                    u && (e[r + 1] = Wc(e[r + 1])),
                      jy(e, c, r, !0),
                      jy(e, c, r, !1),
                      (function cA(e, t, n, r, i) {
                        const o = i ? e.residualClasses : e.residualStyles;
                        null != o && "string" == typeof t && Qr(o, t) >= 0 && (n[r + 1] = Qc(n[r + 1]));
                      })(t, c, e, r, o),
                      (s = Ia(a, l)),
                      o ? (t.classBindings = s) : (t.styleBindings = s);
                  })(i, o, t, n, s, r);
              }
            })(i, null, o, r);
          const s = _();
          if (n !== q && Ge(s, o, n)) {
            const a = i.data[Ze()];
            if (Xy(a, r) && !Wy(i, o)) {
              let l = r ? a.classesWithoutHost : a.stylesWithoutHost;
              null !== l && (n = Kl(l, n || "")), Uc(i, a, s, n, r);
            } else
              !(function MA(e, t, n, r, i, o, s, a) {
                i === q && (i = J);
                let l = 0,
                  u = 0,
                  c = 0 < i.length ? i[0] : null,
                  d = 0 < o.length ? o[0] : null;
                for (; null !== c || null !== d; ) {
                  const f = l < i.length ? i[l + 1] : void 0,
                    h = u < o.length ? o[u + 1] : void 0;
                  let g,
                    p = null;
                  c === d
                    ? ((l += 2), (u += 2), f !== h && ((p = d), (g = h)))
                    : null === d || (null !== c && c < d)
                    ? ((l += 2), (p = c))
                    : ((u += 2), (p = d), (g = h)),
                    null !== p && Zy(e, t, n, r, p, g, s, a),
                    (c = l < i.length ? i[l] : null),
                    (d = u < o.length ? o[u] : null);
                }
              })(
                i,
                a,
                s,
                s[z],
                s[o + 1],
                (s[o + 1] = (function bA(e, t, n) {
                  if (null == n || "" === n) return J;
                  const r = [],
                    i = Gn(n);
                  if (Array.isArray(i)) for (let o = 0; o < i.length; o++) e(r, i[o], !0);
                  else if ("object" == typeof i) for (const o in i) i.hasOwnProperty(o) && e(r, o, i[o]);
                  else "string" == typeof i && t(r, i);
                  return r;
                })(e, t, n)),
                r,
                o
              );
          }
        })(Qy, vA, e, !1);
      }
      function vA(e, t) {
        for (
          let n = (function pA(e) {
            return (
              (function $y(e) {
                (Pe.key = 0), (Pe.keyEnd = 0), (Pe.value = 0), (Pe.valueEnd = 0), (Pe.textEnd = e.length);
              })(e),
              Hy(e, pi(e, 0, Pe.textEnd))
            );
          })(t);
          n >= 0;
          n = Hy(t, n)
        )
          Qy(e, By(t), fA(t));
      }
      function Wy(e, t) {
        return t >= e.expandoStartIndex;
      }
      function Zc(e, t, n, r, i) {
        let o = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (-1 === a ? (a = n.directiveStart) : a++; a < s && ((o = t[a]), (r = Co(r, o.hostAttrs, i)), o !== e); )
          a++;
        return null !== e && (n.directiveStylingLast = a), r;
      }
      function Co(e, t, n) {
        const r = n ? 1 : 2;
        let i = -1;
        if (null !== t)
          for (let o = 0; o < t.length; o++) {
            const s = t[o];
            "number" == typeof s
              ? (i = s)
              : i === r && (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]), mt(e, s, !!n || t[++o]));
          }
        return void 0 === e ? null : e;
      }
      function Qy(e, t, n) {
        mt(e, t, Gn(n));
      }
      function Zy(e, t, n, r, i, o, s, a) {
        if (!(3 & t.type)) return;
        const l = e.data,
          u = l[a + 1],
          c = (function lA(e) {
            return 1 == (1 & e);
          })(u)
            ? Yy(l, t, n, i, yr(u), s)
            : void 0;
        Aa(c) ||
          (Aa(o) ||
            ((function sA(e) {
              return 2 == (2 & e);
            })(u) &&
              (o = Yy(l, null, n, i, a, s))),
          (function fM(e, t, n, r, i) {
            if (t) i ? e.addClass(n, r) : e.removeClass(n, r);
            else {
              let o = -1 === r.indexOf("-") ? void 0 : ut.DashCase;
              null == i
                ? e.removeStyle(n, r, o)
                : ("string" == typeof i && i.endsWith("!important") && ((i = i.slice(0, -10)), (o |= ut.Important)),
                  e.setStyle(n, r, i, o));
            }
          })(r, s, Is(Ze(), n), i, o));
      }
      function Yy(e, t, n, r, i, o) {
        const s = null === t;
        let a;
        for (; i > 0; ) {
          const l = e[i],
            u = Array.isArray(l),
            c = u ? l[1] : l,
            d = null === c;
          let f = n[i + 1];
          f === q && (f = d ? J : void 0);
          let h = d ? Iu(f, r) : c === r ? f : void 0;
          if ((u && !Aa(h) && (h = Iu(l, r)), Aa(h) && ((a = h), s))) return a;
          const p = e[i + 1];
          i = s ? Kn(p) : yr(p);
        }
        if (null !== t) {
          let l = o ? t.residualClasses : t.residualStyles;
          null != l && (a = Iu(l, r));
        }
        return a;
      }
      function Aa(e) {
        return void 0 !== e;
      }
      function Xy(e, t) {
        return 0 != (e.flags & (t ? 8 : 16));
      }
      function N(e, t = "") {
        const n = _(),
          r = Y(),
          i = e + Z,
          o = r.firstCreatePass ? ri(r, i, 1, t, null) : r.data[i],
          s = Jy(r, n, o, t, e);
        (n[i] = s), Ns() && Xs(r, n, s, o), sn(o, !1);
      }
      let Jy = (e, t, n, r, i) => (
        qn(!0),
        (function Qs(e, t) {
          return e.createText(t);
        })(t[z], r)
      );
      function bo(e) {
        return Na("", e, ""), bo;
      }
      function Na(e, t, n) {
        const r = _(),
          i = (function oi(e, t, n, r) {
            return Ge(e, $r(), n) ? t + U(n) + r : q;
          })(r, e, t, n);
        return (
          i !== q &&
            (function In(e, t, n) {
              const r = Is(t, e);
              !(function Rg(e, t, n) {
                e.setValue(t, n);
              })(e[z], r, n);
            })(r, Ze(), i),
          Na
        );
      }
      const vr = void 0;
      var QA = [
        "en",
        [["a", "p"], ["AM", "PM"], vr],
        [["AM", "PM"], vr, vr],
        [
          ["S", "M", "T", "W", "T", "F", "S"],
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        ],
        vr,
        [
          ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        ],
        vr,
        [
          ["B", "A"],
          ["BC", "AD"],
          ["Before Christ", "Anno Domini"],
        ],
        0,
        [6, 0],
        ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
        ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
        ["{1}, {0}", vr, "{1} 'at' {0}", vr],
        [".", ",", ";", "%", "+", "-", "E", "\xd7", "\u2030", "\u221e", "NaN", ":"],
        ["#,##0.###", "#,##0%", "\xa4#,##0.00", "#E0"],
        "USD",
        "$",
        "US Dollar",
        {},
        "ltr",
        function KA(e) {
          const n = Math.floor(Math.abs(e)),
            r = e.toString().replace(/^[^.]*\.?/, "").length;
          return 1 === n && 0 === r ? 1 : 5;
        },
      ];
      let gi = {};
      function Ye(e) {
        const t = (function ZA(e) {
          return e.toLowerCase().replace(/_/g, "-");
        })(e);
        let n = _v(t);
        if (n) return n;
        const r = t.split("-")[0];
        if (((n = _v(r)), n)) return n;
        if ("en" === r) return QA;
        throw new D(701, !1);
      }
      function _v(e) {
        return e in gi || (gi[e] = le.ng && le.ng.common && le.ng.common.locales && le.ng.common.locales[e]), gi[e];
      }
      var S = (() => (
        ((S = S || {})[(S.LocaleId = 0)] = "LocaleId"),
        (S[(S.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
        (S[(S.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
        (S[(S.DaysFormat = 3)] = "DaysFormat"),
        (S[(S.DaysStandalone = 4)] = "DaysStandalone"),
        (S[(S.MonthsFormat = 5)] = "MonthsFormat"),
        (S[(S.MonthsStandalone = 6)] = "MonthsStandalone"),
        (S[(S.Eras = 7)] = "Eras"),
        (S[(S.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
        (S[(S.WeekendRange = 9)] = "WeekendRange"),
        (S[(S.DateFormat = 10)] = "DateFormat"),
        (S[(S.TimeFormat = 11)] = "TimeFormat"),
        (S[(S.DateTimeFormat = 12)] = "DateTimeFormat"),
        (S[(S.NumberSymbols = 13)] = "NumberSymbols"),
        (S[(S.NumberFormats = 14)] = "NumberFormats"),
        (S[(S.CurrencyCode = 15)] = "CurrencyCode"),
        (S[(S.CurrencySymbol = 16)] = "CurrencySymbol"),
        (S[(S.CurrencyName = 17)] = "CurrencyName"),
        (S[(S.Currencies = 18)] = "Currencies"),
        (S[(S.Directionality = 19)] = "Directionality"),
        (S[(S.PluralCase = 20)] = "PluralCase"),
        (S[(S.ExtraData = 21)] = "ExtraData"),
        S
      ))();
      const mi = "en-US";
      let wv = mi;
      class yi {}
      class Wv {}
      class rd extends yi {
        constructor(t, n, r) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new ty(this));
          const i = ht(t);
          (this._bootstrapComponents = Mn(i.bootstrap)),
            (this._r3Injector = jm(
              t,
              n,
              [{ provide: yi, useValue: this }, { provide: ca, useValue: this.componentFactoryResolver }, ...r],
              Ae(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(), this.destroyCbs.forEach(n => n()), (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class id extends Wv {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new rd(this.moduleType, t, []);
        }
      }
      class Kv extends yi {
        constructor(t) {
          super(), (this.componentFactoryResolver = new ty(this)), (this.instance = null);
          const n = new lc(
            [...t.providers, { provide: yi, useValue: this }, { provide: ca, useValue: this.componentFactoryResolver }],
            t.parent || ia(),
            t.debugName,
            new Set(["environment"])
          );
          (this.injector = n), t.runEnvironmentInitializers && n.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(t) {
          this.injector.onDestroy(t);
        }
      }
      function od(e, t, n = null) {
        return new Kv({ providers: e, parent: t, debugName: n, runEnvironmentInitializers: !0 }).injector;
      }
      let Y1 = (() => {
        class e {
          constructor(n) {
            (this._injector = n), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n.id)) {
              const r = am(0, n.type),
                i = r.length > 0 ? od([r], this._injector, `Standalone[${n.type.name}]`) : null;
              this.cachedInjectors.set(n.id, i);
            }
            return this.cachedInjectors.get(n.id);
          }
          ngOnDestroy() {
            try {
              for (const n of this.cachedInjectors.values()) null !== n && n.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (e.ɵprov = P({ token: e, providedIn: "environment", factory: () => new e(M(ln)) })), e;
      })();
      function Qv(e) {
        e.getStandaloneInjector = t => t.get(Y1).getOrCreateStandaloneInjector(e);
      }
      function ad(e, t, n, r) {
        return nD(_(), Qe(), e, t, n, r);
      }
      function No(e, t) {
        const n = e[t];
        return n === q ? void 0 : n;
      }
      function nD(e, t, n, r, i, o) {
        const s = t + n;
        return Ge(e, s, i) ? cn(e, s + 1, o ? r.call(o, i) : r(i)) : No(e, s + 1);
      }
      function rD(e, t, n, r, i, o, s) {
        const a = t + n;
        return (function mr(e, t, n, r) {
          const i = Ge(e, t, n);
          return Ge(e, t + 1, r) || i;
        })(e, a, i, o)
          ? cn(e, a + 2, s ? r.call(s, i, o) : r(i, o))
          : No(e, a + 2);
      }
      function ld(e, t) {
        const n = Y();
        let r;
        const i = e + Z;
        n.firstCreatePass
          ? ((r = (function gN(e, t) {
              if (t)
                for (let n = t.length - 1; n >= 0; n--) {
                  const r = t[n];
                  if (e === r.name) return r;
                }
            })(t, n.pipeRegistry)),
            (n.data[i] = r),
            r.onDestroy && (n.destroyHooks ??= []).push(i, r.onDestroy))
          : (r = n.data[i]);
        const o = r.factory || (r.factory = lr(r.type)),
          s = tt(L);
        try {
          const a = ks(!1),
            l = o();
          return (
            ks(a),
            (function KI(e, t, n, r) {
              n >= e.data.length && ((e.data[n] = null), (e.blueprint[n] = null)), (t[n] = r);
            })(n, _(), i, l),
            l
          );
        } finally {
          tt(s);
        }
      }
      function Ro(e, t) {
        return e[b].data[t].pure;
      }
      function ud(e) {
        return t => {
          setTimeout(e, void 0, t);
        };
      }
      const Xe = class DN extends yn {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          let i = t,
            o = n || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const l = t;
            (i = l.next?.bind(l)), (o = l.error?.bind(l)), (s = l.complete?.bind(l));
          }
          this.__isAsync && ((o = ud(o)), i && (i = ud(i)), s && (s = ud(s)));
          const a = super.subscribe({ next: i, error: o, complete: s });
          return t instanceof St && t.add(a), a;
        }
      };
      let An = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = CN), e;
      })();
      const wN = An,
        EN = class extends wN {
          constructor(t, n, r) {
            super(), (this._declarationLView = t), (this._declarationTContainer = n), (this.elementRef = r);
          }
          get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null;
          }
          createEmbeddedView(t, n) {
            return this.createEmbeddedViewImpl(t, n, null);
          }
          createEmbeddedViewImpl(t, n, r) {
            const i = this._declarationTContainer.tView,
              o = ga(this._declarationLView, i, t, 16, null, i.declTNode, null, null, null, n || null, r || null);
            o[Ui] = this._declarationLView[this._declarationTContainer.index];
            const a = this._declarationLView[tn];
            return null !== a && (o[tn] = a.createEmbeddedView(i)), xc(i, o, t), new mo(o);
          }
        };
      function CN() {
        return Fa(He(), _());
      }
      function Fa(e, t) {
        return 4 & e.type ? new EN(t, e, ti(e, t)) : null;
      }
      let zt = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = NN), e;
      })();
      function NN() {
        return (function pD(e, t) {
          let n;
          const r = t[e.index];
          return (
            ot(r) ? (n = r) : ((n = Km(r, t, null, e)), (t[e.index] = n), ma(t, n)), gD(n, t, e, r), new fD(n, e, t)
          );
        })(He(), _());
      }
      const RN = zt,
        fD = class extends RN {
          constructor(t, n, r) {
            super(), (this._lContainer = t), (this._hostTNode = n), (this._hostLView = r);
          }
          get element() {
            return ti(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new zr(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = bu(this._hostTNode, this._hostLView);
            if (Yp(t)) {
              const n = Fs(t, this._hostLView),
                r = Os(t);
              return new zr(n[b].data[r + 8], n);
            }
            return new zr(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = hD(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - Ve;
          }
          createEmbeddedView(t, n, r) {
            let i, o;
            "number" == typeof r ? (i = r) : null != r && ((i = r.index), (o = r.injector));
            const a = t.createEmbeddedViewImpl(n || {}, o, null);
            return this.insertImpl(a, i, false), a;
          }
          createComponent(t, n, r, i, o) {
            const s =
              t &&
              !(function Qi(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const g = n || {};
              (a = g.index), (r = g.injector), (i = g.projectableNodes), (o = g.environmentInjector || g.ngModuleRef);
            }
            const l = s ? t : new yo(ee(t)),
              u = r || this.parentInjector;
            if (!o && null == l.ngModule) {
              const y = (s ? u : this.parentInjector).get(ln, null);
              y && (o = y);
            }
            ee(l.componentType ?? {});
            const h = l.create(u, i, null, o);
            return this.insertImpl(h.hostView, a, false), h;
          }
          insert(t, n) {
            return this.insertImpl(t, n, !1);
          }
          insertImpl(t, n, r) {
            const i = t._lView,
              o = i[b];
            if (
              (function Pb(e) {
                return ot(e[he]);
              })(i)
            ) {
              const l = this.indexOf(t);
              if (-1 !== l) this.detach(l);
              else {
                const u = i[he],
                  c = new fD(u, u[ze], u[he]);
                c.detach(c.indexOf(t));
              }
            }
            const s = this._adjustIndex(n),
              a = this._lContainer;
            if (
              ((function iM(e, t, n, r) {
                const i = Ve + r,
                  o = n.length;
                r > 0 && (n[i - 1][Vt] = t),
                  r < o - Ve ? ((t[Vt] = n[i]), cg(n, Ve + r, t)) : (n.push(t), (t[Vt] = null)),
                  (t[he] = n);
                const s = t[Ui];
                null !== s &&
                  n !== s &&
                  (function oM(e, t) {
                    const n = e[Br];
                    t[Ce] !== t[he][he][Ce] && (e[yp] = !0), null === n ? (e[Br] = [t]) : n.push(t);
                  })(s, t);
                const a = t[tn];
                null !== a && a.insertView(e), (t[G] |= 128);
              })(o, i, a, s),
              !r)
            ) {
              const l = Gu(s, a),
                u = i[z],
                c = Ys(u, a[nn]);
              null !== c &&
                (function tM(e, t, n, r, i, o) {
                  (r[Ne] = i), (r[ze] = t), no(e, r, n, 1, i, o);
                })(o, a[ze], u, i, c, l);
            }
            return t.attachToViewContainerRef(), cg(fd(a), s, t), t;
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = hD(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = $u(this._lContainer, n);
            r && (Vs(fd(this._lContainer), n), xg(r[b], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = $u(this._lContainer, n);
            return r && null != Vs(fd(this._lContainer), n) ? new mo(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function hD(e) {
        return e[Cs];
      }
      function fd(e) {
        return e[Cs] || (e[Cs] = []);
      }
      let gD = function mD(e, t, n, r) {
        if (e[nn]) return;
        let i;
        (i =
          8 & n.type
            ? fe(r)
            : (function PN(e, t) {
                const n = e[z],
                  r = n.createComment(""),
                  i = st(t, e);
                return (
                  fr(
                    n,
                    Ys(n, i),
                    r,
                    (function uM(e, t) {
                      return e.nextSibling(t);
                    })(n, i),
                    !1
                  ),
                  r
                );
              })(t, n)),
          (e[nn] = i);
      };
      function Po(e, t) {
        return Fa(e, t);
      }
      const Cd = new A("Application Initializer");
      let bd = (() => {
          class e {
            constructor() {
              (this.initialized = !1),
                (this.done = !1),
                (this.donePromise = new Promise((n, r) => {
                  (this.resolve = n), (this.reject = r);
                })),
                (this.appInits = I(Cd, { optional: !0 }) ?? []);
            }
            runInitializers() {
              if (this.initialized) return;
              const n = [];
              for (const i of this.appInits) {
                const o = i();
                if (Ta(o)) n.push(o);
                else if (by(o)) {
                  const s = new Promise((a, l) => {
                    o.subscribe({ complete: a, error: l });
                  });
                  n.push(s);
                }
              }
              const r = () => {
                (this.done = !0), this.resolve();
              };
              Promise.all(n)
                .then(() => {
                  r();
                })
                .catch(i => {
                  this.reject(i);
                }),
                0 === n.length && r(),
                (this.initialized = !0);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        HD = (() => {
          class e {
            log(n) {
              console.log(n);
            }
            warn(n) {
              console.warn(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "platform" })),
            e
          );
        })();
      const Nn = new A("LocaleId", {
        providedIn: "root",
        factory: () =>
          I(Nn, F.Optional | F.SkipSelf) ||
          (function lR() {
            return (typeof $localize < "u" && $localize.locale) || mi;
          })(),
      });
      class cR {
        constructor(t, n) {
          (this.ngModuleFactory = t), (this.componentFactories = n);
        }
      }
      let $D = (() => {
        class e {
          compileModuleSync(n) {
            return new id(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              o = Mn(ht(n).declarations).reduce((s, a) => {
                const l = ee(a);
                return l && s.push(new yo(l)), s;
              }, []);
            return new cR(r, o);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const hR = (() => Promise.resolve(0))();
      function Sd(e) {
        typeof Zone > "u"
          ? hR.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      function qD(...e) {}
      class ue {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Xe(!1)),
            (this.onMicrotaskEmpty = new Xe(!1)),
            (this.onStable = new Xe(!1)),
            (this.onError = new Xe(!1)),
            typeof Zone > "u")
          )
            throw new D(908, !1);
          Zone.assertZonePatched();
          const i = this;
          (i._nesting = 0),
            (i._outer = i._inner = Zone.current),
            Zone.TaskTrackingZoneSpec && (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t && Zone.longStackTraceZoneSpec && (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
            (i.shouldCoalesceEventChangeDetection = !r && n),
            (i.shouldCoalesceRunChangeDetection = r),
            (i.lastRequestAnimationFrameId = -1),
            (i.nativeRequestAnimationFrame = (function pR() {
              let e = le.requestAnimationFrame,
                t = le.cancelAnimationFrame;
              if (typeof Zone < "u" && e && t) {
                const n = e[Zone.__symbol__("OriginalDelegate")];
                n && (e = n);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: t };
            })().nativeRequestAnimationFrame),
            (function yR(e) {
              const t = () => {
                !(function mR(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(le, () => {
                      e.fakeTopEventTask ||
                        (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                          "fakeTopEventTask",
                          () => {
                            (e.lastRequestAnimationFrameId = -1),
                              Td(e),
                              (e.isCheckStableRunning = !0),
                              Md(e),
                              (e.isCheckStableRunning = !1);
                          },
                          void 0,
                          () => {},
                          () => {}
                        )),
                        e.fakeTopEventTask.invoke();
                    })),
                    Td(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, i, o, s, a) => {
                  try {
                    return GD(e), n.invokeTask(i, o, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection && "eventTask" === o.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      WD(e);
                  }
                },
                onInvoke: (n, r, i, o, s, a, l) => {
                  try {
                    return GD(e), n.invoke(i, o, s, a, l);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), WD(e);
                  }
                },
                onHasTask: (n, r, i, o) => {
                  n.hasTask(i, o),
                    r === i &&
                      ("microTask" == o.change
                        ? ((e._hasPendingMicrotasks = o.microTask), Td(e), Md(e))
                        : "macroTask" == o.change && (e.hasPendingMacrotasks = o.macroTask));
                },
                onHandleError: (n, r, i, o) => (n.handleError(i, o), e.runOutsideAngular(() => e.onError.emit(o)), !1),
              });
            })(i);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!ue.isInAngularZone()) throw new D(909, !1);
        }
        static assertNotInAngularZone() {
          if (ue.isInAngularZone()) throw new D(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, i) {
          const o = this._inner,
            s = o.scheduleEventTask("NgZoneEvent: " + i, t, gR, qD, qD);
          try {
            return o.runTask(s, n, r);
          } finally {
            o.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const gR = {};
      function Md(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function Td(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function GD(e) {
        e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function WD(e) {
        e._nesting--, Md(e);
      }
      class vR {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Xe()),
            (this.onMicrotaskEmpty = new Xe()),
            (this.onStable = new Xe()),
            (this.onError = new Xe());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, i) {
          return t.apply(n, r);
        }
      }
      const KD = new A("", { providedIn: "root", factory: QD });
      function QD() {
        const e = I(ue);
        let t = !0;
        return (function R0(...e) {
          const t = Li(e),
            n = (function b0(e, t) {
              return "number" == typeof ql(e) ? e.pop() : t;
            })(e, 1 / 0),
            r = e;
          return r.length ? (1 === r.length ? Lt(r[0]) : Pr(n)(Oe(r, t))) : Yt;
        })(
          new Ee(i => {
            (t = e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks),
              e.runOutsideAngular(() => {
                i.next(t), i.complete();
              });
          }),
          new Ee(i => {
            let o;
            e.runOutsideAngular(() => {
              o = e.onStable.subscribe(() => {
                ue.assertNotInAngularZone(),
                  Sd(() => {
                    !t && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks && ((t = !0), i.next(!0));
                  });
              });
            });
            const s = e.onUnstable.subscribe(() => {
              ue.assertInAngularZone(),
                t &&
                  ((t = !1),
                  e.runOutsideAngular(() => {
                    i.next(!1);
                  }));
            });
            return () => {
              o.unsubscribe(), s.unsubscribe();
            };
          }).pipe(
            (function P0(e = {}) {
              const {
                connector: t = () => new yn(),
                resetOnError: n = !0,
                resetOnComplete: r = !0,
                resetOnRefCountZero: i = !0,
              } = e;
              return o => {
                let s,
                  a,
                  l,
                  u = 0,
                  c = !1,
                  d = !1;
                const f = () => {
                    a?.unsubscribe(), (a = void 0);
                  },
                  h = () => {
                    f(), (s = l = void 0), (c = d = !1);
                  },
                  p = () => {
                    const g = s;
                    h(), g?.unsubscribe();
                  };
                return Le((g, y) => {
                  u++, !d && !c && f();
                  const v = (l = l ?? t());
                  y.add(() => {
                    u--, 0 === u && !d && !c && (a = Gl(p, i));
                  }),
                    v.subscribe(y),
                    !s &&
                      u > 0 &&
                      ((s = new ki({
                        next: m => v.next(m),
                        error: m => {
                          (d = !0), f(), (a = Gl(h, n, m)), v.error(m);
                        },
                        complete: () => {
                          (c = !0), f(), (a = Gl(h, r)), v.complete();
                        },
                      })),
                      Lt(g).subscribe(s));
                })(o);
              };
            })()
          )
        );
      }
      const ZD = new A(""),
        La = new A("");
      let Nd,
        Id = (() => {
          class e {
            constructor(n, r, i) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                Nd ||
                  ((function DR(e) {
                    Nd = e;
                  })(i),
                  i.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone = typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      ue.assertNotInAngularZone(),
                        Sd(() => {
                          (this._isZoneStable = !0), this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (this._pendingCount += 1), (this._didWork = !0), this._pendingCount;
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return this._isZoneStable && 0 === this._pendingCount && !this._ngZone.hasPendingMacrotasks;
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                Sd(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  r => !r.updateCb || !r.updateCb(n) || (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map(n => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, i) {
              let o = -1;
              r &&
                r > 0 &&
                (o = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(s => s.timeoutId !== o)),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: o, updateCb: i });
            }
            whenStable(n, r, i) {
              if (i && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, i), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, i) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(ue), M(Ad), M(La));
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Ad = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return Nd?.findTestabilityInTree(this, n, r) ?? null;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "platform" })),
            e
          );
        })(),
        Qn = null;
      const YD = new A("AllowMultipleToken"),
        Rd = new A("PlatformDestroyListeners"),
        Pd = new A("appBootstrapListener");
      class JD {
        constructor(t, n) {
          (this.name = t), (this.token = n);
        }
      }
      function t_(e, t, n = []) {
        const r = `Platform: ${t}`,
          i = new A(r);
        return (o = []) => {
          let s = xd();
          if (!s || s.injector.get(YD, !1)) {
            const a = [...n, ...o, { provide: i, useValue: !0 }];
            e
              ? e(a)
              : (function ER(e) {
                  if (Qn && !Qn.get(YD, !1)) throw new D(400, !1);
                  (function XD() {
                    !(function wb(e) {
                      Cp = e;
                    })(() => {
                      throw new D(600, !1);
                    });
                  })(),
                    (Qn = e);
                  const t = e.get(r_);
                  (function e_(e) {
                    e.get(fm, null)?.forEach(n => n());
                  })(e);
                })(
                  (function n_(e = [], t) {
                    return Tn.create({
                      name: t,
                      providers: [
                        { provide: sc, useValue: "platform" },
                        { provide: Rd, useValue: new Set([() => (Qn = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function bR(e) {
            const t = xd();
            if (!t) throw new D(401, !1);
            return t;
          })();
        };
      }
      function xd() {
        return Qn?.get(r_) ?? null;
      }
      let r_ = (() => {
        class e {
          constructor(n) {
            (this._injector = n), (this._modules = []), (this._destroyListeners = []), (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const i = (function SR(e = "zone.js", t) {
              return "noop" === e ? new vR() : "zone.js" === e ? new ue(t) : e;
            })(
              r?.ngZone,
              (function i_(e) {
                return {
                  enableLongStackTrace: !1,
                  shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
                  shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
                };
              })({ eventCoalescing: r?.ngZoneEventCoalescing, runCoalescing: r?.ngZoneRunCoalescing })
            );
            return i.run(() => {
              const o = (function Z1(e, t, n) {
                  return new rd(e, t, n);
                })(
                  n.moduleType,
                  this.injector,
                  (function u_(e) {
                    return [
                      { provide: ue, useFactory: e },
                      {
                        provide: ao,
                        multi: !0,
                        useFactory: () => {
                          const t = I(TR, { optional: !0 });
                          return () => t.initialize();
                        },
                      },
                      { provide: l_, useFactory: MR },
                      { provide: KD, useFactory: QD },
                    ];
                  })(() => i)
                ),
                s = o.injector.get(gr, null);
              return (
                i.runOutsideAngular(() => {
                  const a = i.onError.subscribe({
                    next: l => {
                      s.handleError(l);
                    },
                  });
                  o.onDestroy(() => {
                    ja(this._modules, o), a.unsubscribe();
                  });
                }),
                (function o_(e, t, n) {
                  try {
                    const r = n();
                    return Ta(r)
                      ? r.catch(i => {
                          throw (t.runOutsideAngular(() => e.handleError(i)), i);
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(s, i, () => {
                  const a = o.injector.get(bd);
                  return (
                    a.runInitializers(),
                    a.donePromise.then(
                      () => (
                        (function Ev(e) {
                          Mt(e, "Expected localeId to be defined"),
                            "string" == typeof e && (wv = e.toLowerCase().replace(/_/g, "-"));
                        })(o.injector.get(Nn, mi) || mi),
                        this._moduleDoBootstrap(o),
                        o
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const i = s_({}, r);
            return (function _R(e, t, n) {
              const r = new id(n);
              return Promise.resolve(r);
            })(0, 0, n).then(o => this.bootstrapModuleFactory(o, i));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(Dr);
            if (n._bootstrapComponents.length > 0) n._bootstrapComponents.forEach(i => r.bootstrap(i));
            else {
              if (!n.instance.ngDoBootstrap) throw new D(-403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new D(404, !1);
            this._modules.slice().forEach(r => r.destroy()), this._destroyListeners.forEach(r => r());
            const n = this._injector.get(Rd, null);
            n && (n.forEach(r => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(Tn));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      function s_(e, t) {
        return Array.isArray(t) ? t.reduce(s_, e) : { ...e, ...t };
      }
      let Dr = (() => {
        class e {
          constructor() {
            (this._bootstrapListeners = []),
              (this._runningTick = !1),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this._views = []),
              (this.internalErrorHandler = I(l_)),
              (this.componentTypes = []),
              (this.components = []),
              (this.isStable = I(KD)),
              (this._injector = I(ln));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(n, r) {
            const i = n instanceof _m;
            if (!this._injector.get(bd).done)
              throw (
                (!i &&
                  (function Or(e) {
                    const t = ee(e) || Ue(e) || it(e);
                    return null !== t && t.standalone;
                  })(n),
                new D(405, !1))
              );
            let s;
            (s = i ? n : this._injector.get(ca).resolveComponentFactory(n)), this.componentTypes.push(s.componentType);
            const a = (function wR(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(yi),
              u = s.create(Tn.NULL, [], r || s.selector, a),
              c = u.location.nativeElement,
              d = u.injector.get(ZD, null);
            return (
              d?.registerApplication(c),
              u.onDestroy(() => {
                this.detachView(u.hostView), ja(this.components, u), d?.unregisterApplication(c);
              }),
              this._loadComponent(u),
              u
            );
          }
          tick() {
            if (this._runningTick) throw new D(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this.internalErrorHandler(n);
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            ja(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n);
            const r = this._injector.get(Pd, []);
            r.push(...this._bootstrapListeners), r.forEach(i => i(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach(n => n()), this._views.slice().forEach(n => n.destroy());
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return this._destroyListeners.push(n), () => ja(this._destroyListeners, n);
          }
          destroy() {
            if (this._destroyed) throw new D(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function ja(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      const l_ = new A("", { providedIn: "root", factory: () => I(gr).handleError.bind(void 0) });
      function MR() {
        const e = I(ue),
          t = I(gr);
        return n => e.runOutsideAngular(() => t.handleError(n));
      }
      let TR = (() => {
        class e {
          constructor() {
            (this.zone = I(ue)), (this.applicationRef = I(Dr));
          }
          initialize() {
            this._onMicrotaskEmptySubscription ||
              (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
                next: () => {
                  this.zone.run(() => {
                    this.applicationRef.tick();
                  });
                },
              }));
          }
          ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      let Od = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = AR), e;
      })();
      function AR(e) {
        return (function NR(e, t, n) {
          if (ar(e) && !n) {
            const r = at(e.index, t);
            return new mo(r, r);
          }
          return 47 & e.type ? new mo(t[Ce], t) : null;
        })(He(), _(), 16 == (16 & e));
      }
      class h_ {
        constructor() {}
        supports(t) {
          return _a(t);
        }
        create(t) {
          return new kR(t);
        }
      }
      const FR = (e, t) => t;
      class kR {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || FR);
        }
        forEachItem(t) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) t(n);
        }
        forEachOperation(t) {
          let n = this._itHead,
            r = this._removalsHead,
            i = 0,
            o = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < g_(r, i, o)) ? n : r,
              a = g_(s, i, o),
              l = s.currentIndex;
            if (s === r) i--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) i++;
            else {
              o || (o = []);
              const u = a - i,
                c = l - i;
              if (u != c) {
                for (let f = 0; f < u; f++) {
                  const h = f < o.length ? o[f] : (o[f] = 0),
                    p = h + f;
                  c <= p && p < u && (o[f] = h + 1);
                }
                o[s.previousIndex] = c - u;
              }
            }
            a !== l && t(s, a, l);
          }
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
          let n;
          for (n = this._identityChangesHead; null !== n; n = n._nextIdentityChange) t(n);
        }
        diff(t) {
          if ((null == t && (t = []), !_a(t))) throw new D(900, !1);
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let i,
            o,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (o = t[a]),
                (s = this._trackByFn(a, o)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, o, s, a)),
                    Object.is(n.item, o) || this._addIdentityChange(n, o))
                  : ((n = this._mismatch(n, o, s, a)), (r = !0)),
                (n = n._next);
          } else
            (i = 0),
              (function TI(e, t) {
                if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[Symbol.iterator]();
                  let r;
                  for (; !(r = n.next()).done; ) t(r.value);
                }
              })(t, a => {
                (s = this._trackByFn(i, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, i)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, i)), (r = !0)),
                  (n = n._next),
                  i++;
              }),
              (this.length = i);
          return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (t = this._previousItHead = this._itHead; null !== t; t = t._next) t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded) t.previousIndex = t.currentIndex;
            for (this._additionsHead = this._additionsTail = null, t = this._movesHead; null !== t; t = t._nextMoved)
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, n, r, i) {
          let o;
          return (
            null === t ? (o = this._itTail) : ((o = t._prev), this._remove(t)),
            null !== (t = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._reinsertAfter(t, o, i))
              : null !== (t = null === this._linkedRecords ? null : this._linkedRecords.get(r, i))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._moveAfter(t, o, i))
              : (t = this._addAfter(new LR(n, r), o, i)),
            t
          );
        }
        _verifyReinsertion(t, n, r, i) {
          let o = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null);
          return (
            null !== o
              ? (t = this._reinsertAfter(o, t._prev, i))
              : t.currentIndex != i && ((t.currentIndex = i), this._addToMoves(t, i)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const n = t._next;
            this._addToRemovals(this._unlink(t)), (t = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail && (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail && (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail && (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const i = t._prevRemoved,
            o = t._nextRemoved;
          return (
            null === i ? (this._removalsHead = o) : (i._nextRemoved = o),
            null === o ? (this._removalsTail = i) : (o._prevRemoved = i),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _moveAfter(t, n, r) {
          return this._unlink(t), this._insertAfter(t, n, r), this._addToMoves(t, r), t;
        }
        _addAfter(t, n, r) {
          return (
            this._insertAfter(t, n, r),
            (this._additionsTail =
              null === this._additionsTail ? (this._additionsHead = t) : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, n, r) {
          const i = null === n ? this._itHead : n._next;
          return (
            (t._next = i),
            (t._prev = n),
            null === i ? (this._itTail = t) : (i._prev = t),
            null === n ? (this._itHead = t) : (n._next = t),
            null === this._linkedRecords && (this._linkedRecords = new p_()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const n = t._prev,
            r = t._next;
          return null === n ? (this._itHead = r) : (n._next = r), null === r ? (this._itTail = n) : (r._prev = n), t;
        }
        _addToMoves(t, n) {
          return (
            t.previousIndex === n ||
              (this._movesTail = null === this._movesTail ? (this._movesHead = t) : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords && (this._unlinkedRecords = new p_()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t), (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail), (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, n) {
          return (
            (t.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class LR {
        constructor(t, n) {
          (this.item = t),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class jR {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t), (t._nextDup = null), (t._prevDup = null))
            : ((this._tail._nextDup = t), (t._prevDup = this._tail), (t._nextDup = null), (this._tail = t));
        }
        get(t, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if ((null === n || n <= r.currentIndex) && Object.is(r.trackById, t)) return r;
          return null;
        }
        remove(t) {
          const n = t._prevDup,
            r = t._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class p_ {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new jR()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
          const i = this.map.get(t);
          return i ? i.get(t, n) : null;
        }
        remove(t) {
          const n = t.trackById;
          return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function g_(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let i = 0;
        return n && r < n.length && (i = n[r]), r + t + i;
      }
      class m_ {
        constructor() {}
        supports(t) {
          return t instanceof Map || kc(t);
        }
        create() {
          return new BR();
        }
      }
      class BR {
        constructor() {
          (this._records = new Map()),
            (this._mapHead = null),
            (this._appendAfter = null),
            (this._previousMapHead = null),
            (this._changesHead = null),
            (this._changesTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null);
        }
        get isDirty() {
          return null !== this._additionsHead || null !== this._changesHead || null !== this._removalsHead;
        }
        forEachItem(t) {
          let n;
          for (n = this._mapHead; null !== n; n = n._next) t(n);
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousMapHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachChangedItem(t) {
          let n;
          for (n = this._changesHead; null !== n; n = n._nextChanged) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        diff(t) {
          if (t) {
            if (!(t instanceof Map || kc(t))) throw new D(900, !1);
          } else t = new Map();
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let n = this._mapHead;
          if (
            ((this._appendAfter = null),
            this._forEach(t, (r, i) => {
              if (n && n.key === i) this._maybeAddToChanges(n, r), (this._appendAfter = n), (n = n._next);
              else {
                const o = this._getOrCreateRecordForKey(i, r);
                n = this._insertBeforeOrAppend(n, o);
              }
            }),
            n)
          ) {
            n._prev && (n._prev._next = null), (this._removalsHead = n);
            for (let r = n; null !== r; r = r._nextRemoved)
              r === this._mapHead && (this._mapHead = null),
                this._records.delete(r.key),
                (r._nextRemoved = r._next),
                (r.previousValue = r.currentValue),
                (r.currentValue = null),
                (r._prev = null),
                (r._next = null);
          }
          return (
            this._changesTail && (this._changesTail._nextChanged = null),
            this._additionsTail && (this._additionsTail._nextAdded = null),
            this.isDirty
          );
        }
        _insertBeforeOrAppend(t, n) {
          if (t) {
            const r = t._prev;
            return (
              (n._next = t),
              (n._prev = r),
              (t._prev = n),
              r && (r._next = n),
              t === this._mapHead && (this._mapHead = n),
              (this._appendAfter = t),
              t
            );
          }
          return (
            this._appendAfter ? ((this._appendAfter._next = n), (n._prev = this._appendAfter)) : (this._mapHead = n),
            (this._appendAfter = n),
            null
          );
        }
        _getOrCreateRecordForKey(t, n) {
          if (this._records.has(t)) {
            const i = this._records.get(t);
            this._maybeAddToChanges(i, n);
            const o = i._prev,
              s = i._next;
            return o && (o._next = s), s && (s._prev = o), (i._next = null), (i._prev = null), i;
          }
          const r = new VR(t);
          return this._records.set(t, r), (r.currentValue = n), this._addToAdditions(r), r;
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (this._previousMapHead = this._mapHead, t = this._previousMapHead; null !== t; t = t._next)
              t._nextPrevious = t._next;
            for (t = this._changesHead; null !== t; t = t._nextChanged) t.previousValue = t.currentValue;
            for (t = this._additionsHead; null != t; t = t._nextAdded) t.previousValue = t.currentValue;
            (this._changesHead = this._changesTail = null),
              (this._additionsHead = this._additionsTail = null),
              (this._removalsHead = null);
          }
        }
        _maybeAddToChanges(t, n) {
          Object.is(n, t.currentValue) ||
            ((t.previousValue = t.currentValue), (t.currentValue = n), this._addToChanges(t));
        }
        _addToAdditions(t) {
          null === this._additionsHead
            ? (this._additionsHead = this._additionsTail = t)
            : ((this._additionsTail._nextAdded = t), (this._additionsTail = t));
        }
        _addToChanges(t) {
          null === this._changesHead
            ? (this._changesHead = this._changesTail = t)
            : ((this._changesTail._nextChanged = t), (this._changesTail = t));
        }
        _forEach(t, n) {
          t instanceof Map ? t.forEach(n) : Object.keys(t).forEach(r => n(t[r], r));
        }
      }
      class VR {
        constructor(t) {
          (this.key = t),
            (this.previousValue = null),
            (this.currentValue = null),
            (this._nextPrevious = null),
            (this._next = null),
            (this._prev = null),
            (this._nextAdded = null),
            (this._nextRemoved = null),
            (this._nextChanged = null);
        }
      }
      function y_() {
        return new Ha([new h_()]);
      }
      let Ha = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const i = r.factories.slice();
              n = n.concat(i);
            }
            return new e(n);
          }
          static extend(n) {
            return { provide: e, useFactory: r => e.create(n, r || y_()), deps: [[e, new Us(), new $s()]] };
          }
          find(n) {
            const r = this.factories.find(i => i.supports(n));
            if (null != r) return r;
            throw new D(901, !1);
          }
        }
        return (e.ɵprov = P({ token: e, providedIn: "root", factory: y_ })), e;
      })();
      function v_() {
        return new Oo([new m_()]);
      }
      let Oo = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (r) {
              const i = r.factories.slice();
              n = n.concat(i);
            }
            return new e(n);
          }
          static extend(n) {
            return { provide: e, useFactory: r => e.create(n, r || v_()), deps: [[e, new Us(), new $s()]] };
          }
          find(n) {
            const r = this.factories.find(i => i.supports(n));
            if (r) return r;
            throw new D(901, !1);
          }
        }
        return (e.ɵprov = P({ token: e, providedIn: "root", factory: v_ })), e;
      })();
      const UR = t_(null, "core", []);
      let zR = (() => {
          class e {
            constructor(n) {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(Dr));
            }),
            (e.ɵmod = en({ type: e })),
            (e.ɵinj = jt({})),
            e
          );
        })(),
        b_ = (() => {
          class e {
            get whenAllTasksComplete() {
              return 0 === this.collection.size && this.complete(), this.promise;
            }
            constructor() {
              (this.taskId = 0),
                (this.collection = new Set()),
                (this.ngZone = I(ue)),
                (this.completed = !1),
                this.ngZone.runOutsideAngular(() => {
                  this.promise = new Promise(n => {
                    this.resolve = n;
                  });
                });
            }
            add() {
              if (this.completed) return -1;
              const n = this.taskId++;
              return this.collection.add(n), n;
            }
            remove(n) {
              this.completed || (this.collection.delete(n), 0 === this.collection.size && this.complete());
            }
            ngOnDestroy() {
              this.complete(), this.collection.clear();
            }
            complete() {
              (this.completed = !0), this.resolve();
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        $d = null;
      function _i() {
        return $d;
      }
      class nP {}
      const et = new A("DocumentToken");
      let Ud = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({
            token: e,
            factory: function () {
              return I(iP);
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      const rP = new A("Location Initialized");
      let iP = (() => {
        class e extends Ud {
          constructor() {
            super(), (this._doc = I(et)), (this._location = window.location), (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return _i().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = _i().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("popstate", n, !1), () => r.removeEventListener("popstate", n);
          }
          onHashChange(n) {
            const r = _i().getGlobalEventTarget(this._doc, "window");
            return r.addEventListener("hashchange", n, !1), () => r.removeEventListener("hashchange", n);
          }
          get href() {
            return this._location.href;
          }
          get protocol() {
            return this._location.protocol;
          }
          get hostname() {
            return this._location.hostname;
          }
          get port() {
            return this._location.port;
          }
          get pathname() {
            return this._location.pathname;
          }
          get search() {
            return this._location.search;
          }
          get hash() {
            return this._location.hash;
          }
          set pathname(n) {
            this._location.pathname = n;
          }
          pushState(n, r, i) {
            this._history.pushState(n, r, i);
          }
          replaceState(n, r, i) {
            this._history.replaceState(n, r, i);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({
            token: e,
            factory: function () {
              return new e();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      function zd(e, t) {
        if (0 == e.length) return t;
        if (0 == t.length) return e;
        let n = 0;
        return (
          e.endsWith("/") && n++, t.startsWith("/") && n++, 2 == n ? e + t.substring(1) : 1 == n ? e + t : e + "/" + t
        );
      }
      function M_(e) {
        const t = e.match(/#|\?|$/),
          n = (t && t.index) || e.length;
        return e.slice(0, n - ("/" === e[n - 1] ? 1 : 0)) + e.slice(n);
      }
      function Rn(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let wr = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({
            token: e,
            factory: function () {
              return I(I_);
            },
            providedIn: "root",
          })),
          e
        );
      })();
      const T_ = new A("appBaseHref");
      let I_ = (() => {
          class e extends wr {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                (this._baseHref = r ?? this._platformLocation.getBaseHrefFromDOM() ?? I(et).location?.origin ?? "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return zd(this._baseHref, n);
            }
            path(n = !1) {
              const r = this._platformLocation.pathname + Rn(this._platformLocation.search),
                i = this._platformLocation.hash;
              return i && n ? `${r}${i}` : r;
            }
            pushState(n, r, i, o) {
              const s = this.prepareExternalUrl(i + Rn(o));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, i, o) {
              const s = this.prepareExternalUrl(i + Rn(o));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(Ud), M(T_, 8));
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        oP = (() => {
          class e extends wr {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = zd(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, i, o) {
              let s = this.prepareExternalUrl(i + Rn(o));
              0 == s.length && (s = this._platformLocation.pathname), this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, i, o) {
              let s = this.prepareExternalUrl(i + Rn(o));
              0 == s.length && (s = this._platformLocation.pathname), this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(Ud), M(T_, 8));
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        qd = (() => {
          class e {
            constructor(n) {
              (this._subject = new Xe()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = n);
              const r = this._locationStrategy.getBaseHref();
              (this._basePath = (function lP(e) {
                if (new RegExp("^(https?:)?//").test(e)) {
                  const [, n] = e.split(/\/\/[^\/]+/);
                  return n;
                }
                return e;
              })(M_(A_(r)))),
                this._locationStrategy.onPopState(i => {
                  this._subject.emit({ url: this.path(!0), pop: !0, state: i.state, type: i.type });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(), (this._urlChangeListeners = []);
            }
            path(n = !1) {
              return this.normalize(this._locationStrategy.path(n));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + Rn(r));
            }
            normalize(n) {
              return e.stripTrailingSlash(
                (function aP(e, t) {
                  if (!e || !t.startsWith(e)) return t;
                  const n = t.substring(e.length);
                  return "" === n || ["/", ";", "?", "#"].includes(n[0]) ? n : t;
                })(this._basePath, A_(n))
              );
            }
            prepareExternalUrl(n) {
              return n && "/" !== n[0] && (n = "/" + n), this._locationStrategy.prepareExternalUrl(n);
            }
            go(n, r = "", i = null) {
              this._locationStrategy.pushState(i, "", n, r),
                this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Rn(r)), i);
            }
            replaceState(n, r = "", i = null) {
              this._locationStrategy.replaceState(i, "", n, r),
                this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Rn(r)), i);
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(n = 0) {
              this._locationStrategy.historyGo?.(n);
            }
            onUrlChange(n) {
              return (
                this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe(r => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(n);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach(i => i(n, r));
            }
            subscribe(n, r, i) {
              return this._subject.subscribe({ next: n, error: r, complete: i });
            }
          }
          return (
            (e.normalizeQueryParams = Rn),
            (e.joinWithSlash = zd),
            (e.stripTrailingSlash = M_),
            (e.ɵfac = function (n) {
              return new (n || e)(M(wr));
            }),
            (e.ɵprov = P({
              token: e,
              factory: function () {
                return (function sP() {
                  return new qd(M(wr));
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function A_(e) {
        return e.replace(/\/index.html$/, "");
      }
      var De = (() => (((De = De || {})[(De.Format = 0)] = "Format"), (De[(De.Standalone = 1)] = "Standalone"), De))(),
        Q = (() => (
          ((Q = Q || {})[(Q.Narrow = 0)] = "Narrow"),
          (Q[(Q.Abbreviated = 1)] = "Abbreviated"),
          (Q[(Q.Wide = 2)] = "Wide"),
          (Q[(Q.Short = 3)] = "Short"),
          Q
        ))(),
        ge = (() => (
          ((ge = ge || {})[(ge.Short = 0)] = "Short"),
          (ge[(ge.Medium = 1)] = "Medium"),
          (ge[(ge.Long = 2)] = "Long"),
          (ge[(ge.Full = 3)] = "Full"),
          ge
        ))(),
        k = (() => (
          ((k = k || {})[(k.Decimal = 0)] = "Decimal"),
          (k[(k.Group = 1)] = "Group"),
          (k[(k.List = 2)] = "List"),
          (k[(k.PercentSign = 3)] = "PercentSign"),
          (k[(k.PlusSign = 4)] = "PlusSign"),
          (k[(k.MinusSign = 5)] = "MinusSign"),
          (k[(k.Exponential = 6)] = "Exponential"),
          (k[(k.SuperscriptingExponent = 7)] = "SuperscriptingExponent"),
          (k[(k.PerMille = 8)] = "PerMille"),
          (k[(k.Infinity = 9)] = "Infinity"),
          (k[(k.NaN = 10)] = "NaN"),
          (k[(k.TimeSeparator = 11)] = "TimeSeparator"),
          (k[(k.CurrencyDecimal = 12)] = "CurrencyDecimal"),
          (k[(k.CurrencyGroup = 13)] = "CurrencyGroup"),
          k
        ))();
      function Ua(e, t) {
        return Pt(Ye(e)[S.DateFormat], t);
      }
      function za(e, t) {
        return Pt(Ye(e)[S.TimeFormat], t);
      }
      function qa(e, t) {
        return Pt(Ye(e)[S.DateTimeFormat], t);
      }
      function Rt(e, t) {
        const n = Ye(e),
          r = n[S.NumberSymbols][t];
        if (typeof r > "u") {
          if (t === k.CurrencyDecimal) return n[S.NumberSymbols][k.Decimal];
          if (t === k.CurrencyGroup) return n[S.NumberSymbols][k.Group];
        }
        return r;
      }
      function R_(e) {
        if (!e[S.ExtraData])
          throw new Error(
            `Missing extra locale data for the locale "${
              e[S.LocaleId]
            }". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`
          );
      }
      function Pt(e, t) {
        for (let n = t; n > -1; n--) if (typeof e[n] < "u") return e[n];
        throw new Error("Locale data API: locale data undefined");
      }
      function Wd(e) {
        const [t, n] = e.split(":");
        return { hours: +t, minutes: +n };
      }
      const wP =
          /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
        Fo = {},
        EP =
          /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
      var xe = (() => (
          ((xe = xe || {})[(xe.Short = 0)] = "Short"),
          (xe[(xe.ShortGMT = 1)] = "ShortGMT"),
          (xe[(xe.Long = 2)] = "Long"),
          (xe[(xe.Extended = 3)] = "Extended"),
          xe
        ))(),
        j = (() => (
          ((j = j || {})[(j.FullYear = 0)] = "FullYear"),
          (j[(j.Month = 1)] = "Month"),
          (j[(j.Date = 2)] = "Date"),
          (j[(j.Hours = 3)] = "Hours"),
          (j[(j.Minutes = 4)] = "Minutes"),
          (j[(j.Seconds = 5)] = "Seconds"),
          (j[(j.FractionalSeconds = 6)] = "FractionalSeconds"),
          (j[(j.Day = 7)] = "Day"),
          j
        ))(),
        K = (() => (
          ((K = K || {})[(K.DayPeriods = 0)] = "DayPeriods"),
          (K[(K.Days = 1)] = "Days"),
          (K[(K.Months = 2)] = "Months"),
          (K[(K.Eras = 3)] = "Eras"),
          K
        ))();
      function CP(e, t, n, r) {
        let i = (function PP(e) {
          if (O_(e)) return e;
          if ("number" == typeof e && !isNaN(e)) return new Date(e);
          if ("string" == typeof e) {
            if (((e = e.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(e))) {
              const [i, o = 1, s = 1] = e.split("-").map(a => +a);
              return Ga(i, o - 1, s);
            }
            const n = parseFloat(e);
            if (!isNaN(e - n)) return new Date(n);
            let r;
            if ((r = e.match(wP)))
              return (function xP(e) {
                const t = new Date(0);
                let n = 0,
                  r = 0;
                const i = e[8] ? t.setUTCFullYear : t.setFullYear,
                  o = e[8] ? t.setUTCHours : t.setHours;
                e[9] && ((n = Number(e[9] + e[10])), (r = Number(e[9] + e[11]))),
                  i.call(t, Number(e[1]), Number(e[2]) - 1, Number(e[3]));
                const s = Number(e[4] || 0) - n,
                  a = Number(e[5] || 0) - r,
                  l = Number(e[6] || 0),
                  u = Math.floor(1e3 * parseFloat("0." + (e[7] || 0)));
                return o.call(t, s, a, l, u), t;
              })(r);
          }
          const t = new Date(e);
          if (!O_(t)) throw new Error(`Unable to convert "${e}" into a date`);
          return t;
        })(e);
        t = Pn(n, t) || t;
        let a,
          s = [];
        for (; t; ) {
          if (((a = EP.exec(t)), !a)) {
            s.push(t);
            break;
          }
          {
            s = s.concat(a.slice(1));
            const c = s.pop();
            if (!c) break;
            t = c;
          }
        }
        let l = i.getTimezoneOffset();
        r &&
          ((l = x_(r, l)),
          (i = (function RP(e, t, n) {
            const r = n ? -1 : 1,
              i = e.getTimezoneOffset();
            return (function NP(e, t) {
              return (e = new Date(e.getTime())).setMinutes(e.getMinutes() + t), e;
            })(e, r * (x_(t, i) - i));
          })(i, r, !0)));
        let u = "";
        return (
          s.forEach(c => {
            const d = (function AP(e) {
              if (Qd[e]) return Qd[e];
              let t;
              switch (e) {
                case "G":
                case "GG":
                case "GGG":
                  t = ce(K.Eras, Q.Abbreviated);
                  break;
                case "GGGG":
                  t = ce(K.Eras, Q.Wide);
                  break;
                case "GGGGG":
                  t = ce(K.Eras, Q.Narrow);
                  break;
                case "y":
                  t = Me(j.FullYear, 1, 0, !1, !0);
                  break;
                case "yy":
                  t = Me(j.FullYear, 2, 0, !0, !0);
                  break;
                case "yyy":
                  t = Me(j.FullYear, 3, 0, !1, !0);
                  break;
                case "yyyy":
                  t = Me(j.FullYear, 4, 0, !1, !0);
                  break;
                case "Y":
                  t = Za(1);
                  break;
                case "YY":
                  t = Za(2, !0);
                  break;
                case "YYY":
                  t = Za(3);
                  break;
                case "YYYY":
                  t = Za(4);
                  break;
                case "M":
                case "L":
                  t = Me(j.Month, 1, 1);
                  break;
                case "MM":
                case "LL":
                  t = Me(j.Month, 2, 1);
                  break;
                case "MMM":
                  t = ce(K.Months, Q.Abbreviated);
                  break;
                case "MMMM":
                  t = ce(K.Months, Q.Wide);
                  break;
                case "MMMMM":
                  t = ce(K.Months, Q.Narrow);
                  break;
                case "LLL":
                  t = ce(K.Months, Q.Abbreviated, De.Standalone);
                  break;
                case "LLLL":
                  t = ce(K.Months, Q.Wide, De.Standalone);
                  break;
                case "LLLLL":
                  t = ce(K.Months, Q.Narrow, De.Standalone);
                  break;
                case "w":
                  t = Kd(1);
                  break;
                case "ww":
                  t = Kd(2);
                  break;
                case "W":
                  t = Kd(1, !0);
                  break;
                case "d":
                  t = Me(j.Date, 1);
                  break;
                case "dd":
                  t = Me(j.Date, 2);
                  break;
                case "c":
                case "cc":
                  t = Me(j.Day, 1);
                  break;
                case "ccc":
                  t = ce(K.Days, Q.Abbreviated, De.Standalone);
                  break;
                case "cccc":
                  t = ce(K.Days, Q.Wide, De.Standalone);
                  break;
                case "ccccc":
                  t = ce(K.Days, Q.Narrow, De.Standalone);
                  break;
                case "cccccc":
                  t = ce(K.Days, Q.Short, De.Standalone);
                  break;
                case "E":
                case "EE":
                case "EEE":
                  t = ce(K.Days, Q.Abbreviated);
                  break;
                case "EEEE":
                  t = ce(K.Days, Q.Wide);
                  break;
                case "EEEEE":
                  t = ce(K.Days, Q.Narrow);
                  break;
                case "EEEEEE":
                  t = ce(K.Days, Q.Short);
                  break;
                case "a":
                case "aa":
                case "aaa":
                  t = ce(K.DayPeriods, Q.Abbreviated);
                  break;
                case "aaaa":
                  t = ce(K.DayPeriods, Q.Wide);
                  break;
                case "aaaaa":
                  t = ce(K.DayPeriods, Q.Narrow);
                  break;
                case "b":
                case "bb":
                case "bbb":
                  t = ce(K.DayPeriods, Q.Abbreviated, De.Standalone, !0);
                  break;
                case "bbbb":
                  t = ce(K.DayPeriods, Q.Wide, De.Standalone, !0);
                  break;
                case "bbbbb":
                  t = ce(K.DayPeriods, Q.Narrow, De.Standalone, !0);
                  break;
                case "B":
                case "BB":
                case "BBB":
                  t = ce(K.DayPeriods, Q.Abbreviated, De.Format, !0);
                  break;
                case "BBBB":
                  t = ce(K.DayPeriods, Q.Wide, De.Format, !0);
                  break;
                case "BBBBB":
                  t = ce(K.DayPeriods, Q.Narrow, De.Format, !0);
                  break;
                case "h":
                  t = Me(j.Hours, 1, -12);
                  break;
                case "hh":
                  t = Me(j.Hours, 2, -12);
                  break;
                case "H":
                  t = Me(j.Hours, 1);
                  break;
                case "HH":
                  t = Me(j.Hours, 2);
                  break;
                case "m":
                  t = Me(j.Minutes, 1);
                  break;
                case "mm":
                  t = Me(j.Minutes, 2);
                  break;
                case "s":
                  t = Me(j.Seconds, 1);
                  break;
                case "ss":
                  t = Me(j.Seconds, 2);
                  break;
                case "S":
                  t = Me(j.FractionalSeconds, 1);
                  break;
                case "SS":
                  t = Me(j.FractionalSeconds, 2);
                  break;
                case "SSS":
                  t = Me(j.FractionalSeconds, 3);
                  break;
                case "Z":
                case "ZZ":
                case "ZZZ":
                  t = Ka(xe.Short);
                  break;
                case "ZZZZZ":
                  t = Ka(xe.Extended);
                  break;
                case "O":
                case "OO":
                case "OOO":
                case "z":
                case "zz":
                case "zzz":
                  t = Ka(xe.ShortGMT);
                  break;
                case "OOOO":
                case "ZZZZ":
                case "zzzz":
                  t = Ka(xe.Long);
                  break;
                default:
                  return null;
              }
              return (Qd[e] = t), t;
            })(c);
            u += d ? d(i, n, l) : "''" === c ? "'" : c.replace(/(^'|'$)/g, "").replace(/''/g, "'");
          }),
          u
        );
      }
      function Ga(e, t, n) {
        const r = new Date(0);
        return r.setFullYear(e, t, n), r.setHours(0, 0, 0), r;
      }
      function Pn(e, t) {
        const n = (function uP(e) {
          return Ye(e)[S.LocaleId];
        })(e);
        if (((Fo[n] = Fo[n] || {}), Fo[n][t])) return Fo[n][t];
        let r = "";
        switch (t) {
          case "shortDate":
            r = Ua(e, ge.Short);
            break;
          case "mediumDate":
            r = Ua(e, ge.Medium);
            break;
          case "longDate":
            r = Ua(e, ge.Long);
            break;
          case "fullDate":
            r = Ua(e, ge.Full);
            break;
          case "shortTime":
            r = za(e, ge.Short);
            break;
          case "mediumTime":
            r = za(e, ge.Medium);
            break;
          case "longTime":
            r = za(e, ge.Long);
            break;
          case "fullTime":
            r = za(e, ge.Full);
            break;
          case "short":
            const i = Pn(e, "shortTime"),
              o = Pn(e, "shortDate");
            r = Wa(qa(e, ge.Short), [i, o]);
            break;
          case "medium":
            const s = Pn(e, "mediumTime"),
              a = Pn(e, "mediumDate");
            r = Wa(qa(e, ge.Medium), [s, a]);
            break;
          case "long":
            const l = Pn(e, "longTime"),
              u = Pn(e, "longDate");
            r = Wa(qa(e, ge.Long), [l, u]);
            break;
          case "full":
            const c = Pn(e, "fullTime"),
              d = Pn(e, "fullDate");
            r = Wa(qa(e, ge.Full), [c, d]);
        }
        return r && (Fo[n][t] = r), r;
      }
      function Wa(e, t) {
        return (
          t &&
            (e = e.replace(/\{([^}]+)}/g, function (n, r) {
              return null != t && r in t ? t[r] : n;
            })),
          e
        );
      }
      function Gt(e, t, n = "-", r, i) {
        let o = "";
        (e < 0 || (i && e <= 0)) && (i ? (e = 1 - e) : ((e = -e), (o = n)));
        let s = String(e);
        for (; s.length < t; ) s = "0" + s;
        return r && (s = s.slice(s.length - t)), o + s;
      }
      function Me(e, t, n = 0, r = !1, i = !1) {
        return function (o, s) {
          let a = (function SP(e, t) {
            switch (e) {
              case j.FullYear:
                return t.getFullYear();
              case j.Month:
                return t.getMonth();
              case j.Date:
                return t.getDate();
              case j.Hours:
                return t.getHours();
              case j.Minutes:
                return t.getMinutes();
              case j.Seconds:
                return t.getSeconds();
              case j.FractionalSeconds:
                return t.getMilliseconds();
              case j.Day:
                return t.getDay();
              default:
                throw new Error(`Unknown DateType value "${e}".`);
            }
          })(e, o);
          if (((n > 0 || a > -n) && (a += n), e === j.Hours)) 0 === a && -12 === n && (a = 12);
          else if (e === j.FractionalSeconds)
            return (function bP(e, t) {
              return Gt(e, 3).substring(0, t);
            })(a, t);
          const l = Rt(s, k.MinusSign);
          return Gt(a, t, l, r, i);
        };
      }
      function ce(e, t, n = De.Format, r = !1) {
        return function (i, o) {
          return (function MP(e, t, n, r, i, o) {
            switch (n) {
              case K.Months:
                return (function fP(e, t, n) {
                  const r = Ye(e),
                    o = Pt([r[S.MonthsFormat], r[S.MonthsStandalone]], t);
                  return Pt(o, n);
                })(t, i, r)[e.getMonth()];
              case K.Days:
                return (function dP(e, t, n) {
                  const r = Ye(e),
                    o = Pt([r[S.DaysFormat], r[S.DaysStandalone]], t);
                  return Pt(o, n);
                })(t, i, r)[e.getDay()];
              case K.DayPeriods:
                const s = e.getHours(),
                  a = e.getMinutes();
                if (o) {
                  const u = (function mP(e) {
                      const t = Ye(e);
                      return (
                        R_(t), (t[S.ExtraData][2] || []).map(r => ("string" == typeof r ? Wd(r) : [Wd(r[0]), Wd(r[1])]))
                      );
                    })(t),
                    c = (function yP(e, t, n) {
                      const r = Ye(e);
                      R_(r);
                      const o = Pt([r[S.ExtraData][0], r[S.ExtraData][1]], t) || [];
                      return Pt(o, n) || [];
                    })(t, i, r),
                    d = u.findIndex(f => {
                      if (Array.isArray(f)) {
                        const [h, p] = f,
                          g = s >= h.hours && a >= h.minutes,
                          y = s < p.hours || (s === p.hours && a < p.minutes);
                        if (h.hours < p.hours) {
                          if (g && y) return !0;
                        } else if (g || y) return !0;
                      } else if (f.hours === s && f.minutes === a) return !0;
                      return !1;
                    });
                  if (-1 !== d) return c[d];
                }
                return (function cP(e, t, n) {
                  const r = Ye(e),
                    o = Pt([r[S.DayPeriodsFormat], r[S.DayPeriodsStandalone]], t);
                  return Pt(o, n);
                })(t, i, r)[s < 12 ? 0 : 1];
              case K.Eras:
                return (function hP(e, t) {
                  return Pt(Ye(e)[S.Eras], t);
                })(t, r)[e.getFullYear() <= 0 ? 0 : 1];
              default:
                throw new Error(`unexpected translation type ${n}`);
            }
          })(i, o, e, t, n, r);
        };
      }
      function Ka(e) {
        return function (t, n, r) {
          const i = -1 * r,
            o = Rt(n, k.MinusSign),
            s = i > 0 ? Math.floor(i / 60) : Math.ceil(i / 60);
          switch (e) {
            case xe.Short:
              return (i >= 0 ? "+" : "") + Gt(s, 2, o) + Gt(Math.abs(i % 60), 2, o);
            case xe.ShortGMT:
              return "GMT" + (i >= 0 ? "+" : "") + Gt(s, 1, o);
            case xe.Long:
              return "GMT" + (i >= 0 ? "+" : "") + Gt(s, 2, o) + ":" + Gt(Math.abs(i % 60), 2, o);
            case xe.Extended:
              return 0 === r ? "Z" : (i >= 0 ? "+" : "") + Gt(s, 2, o) + ":" + Gt(Math.abs(i % 60), 2, o);
            default:
              throw new Error(`Unknown zone width "${e}"`);
          }
        };
      }
      const TP = 0,
        Qa = 4;
      function P_(e) {
        return Ga(e.getFullYear(), e.getMonth(), e.getDate() + (Qa - e.getDay()));
      }
      function Kd(e, t = !1) {
        return function (n, r) {
          let i;
          if (t) {
            const o = new Date(n.getFullYear(), n.getMonth(), 1).getDay() - 1,
              s = n.getDate();
            i = 1 + Math.floor((s + o) / 7);
          } else {
            const o = P_(n),
              s = (function IP(e) {
                const t = Ga(e, TP, 1).getDay();
                return Ga(e, 0, 1 + (t <= Qa ? Qa : Qa + 7) - t);
              })(o.getFullYear()),
              a = o.getTime() - s.getTime();
            i = 1 + Math.round(a / 6048e5);
          }
          return Gt(i, e, Rt(r, k.MinusSign));
        };
      }
      function Za(e, t = !1) {
        return function (n, r) {
          return Gt(P_(n).getFullYear(), e, Rt(r, k.MinusSign), t);
        };
      }
      const Qd = {};
      function x_(e, t) {
        e = e.replace(/:/g, "");
        const n = Date.parse("Jan 01, 1970 00:00:00 " + e) / 6e4;
        return isNaN(n) ? t : n;
      }
      function O_(e) {
        return e instanceof Date && !isNaN(e.valueOf());
      }
      function j_(e, t) {
        t = encodeURIComponent(t);
        for (const n of e.split(";")) {
          const r = n.indexOf("="),
            [i, o] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
          if (i.trim() === t) return decodeURIComponent(o);
        }
        return null;
      }
      const tf = /\s+/,
        B_ = [];
      let V_ = (() => {
        class e {
          constructor(n, r, i, o) {
            (this._iterableDiffers = n),
              (this._keyValueDiffers = r),
              (this._ngEl = i),
              (this._renderer = o),
              (this.initialClasses = B_),
              (this.stateMap = new Map());
          }
          set klass(n) {
            this.initialClasses = null != n ? n.trim().split(tf) : B_;
          }
          set ngClass(n) {
            this.rawClass = "string" == typeof n ? n.trim().split(tf) : n;
          }
          ngDoCheck() {
            for (const r of this.initialClasses) this._updateState(r, !0);
            const n = this.rawClass;
            if (Array.isArray(n) || n instanceof Set) for (const r of n) this._updateState(r, !0);
            else if (null != n) for (const r of Object.keys(n)) this._updateState(r, !!n[r]);
            this._applyStateDiff();
          }
          _updateState(n, r) {
            const i = this.stateMap.get(n);
            void 0 !== i
              ? (i.enabled !== r && ((i.changed = !0), (i.enabled = r)), (i.touched = !0))
              : this.stateMap.set(n, { enabled: r, changed: !0, touched: !0 });
          }
          _applyStateDiff() {
            for (const n of this.stateMap) {
              const r = n[0],
                i = n[1];
              i.changed
                ? (this._toggleClass(r, i.enabled), (i.changed = !1))
                : i.touched || (i.enabled && this._toggleClass(r, !1), this.stateMap.delete(r)),
                (i.touched = !1);
            }
          }
          _toggleClass(n, r) {
            (n = n.trim()).length > 0 &&
              n.split(tf).forEach(i => {
                r
                  ? this._renderer.addClass(this._ngEl.nativeElement, i)
                  : this._renderer.removeClass(this._ngEl.nativeElement, i);
              });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(L(Ha), L(Oo), L(Wn), L(da));
          }),
          (e.ɵdir = Ke({
            type: e,
            selectors: [["", "ngClass", ""]],
            inputs: { klass: ["class", "klass"], ngClass: "ngClass" },
            standalone: !0,
          })),
          e
        );
      })();
      class GP {
        constructor(t, n, r, i) {
          (this.$implicit = t), (this.ngForOf = n), (this.index = r), (this.count = i);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let nf = (() => {
        class e {
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(n, r, i) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = i),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ && n && (this._differ = this._differs.find(n).create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((i, o, s) => {
              if (null == i.previousIndex)
                r.createEmbeddedView(this._template, new GP(i.item, this._ngForOf, -1, -1), null === s ? void 0 : s);
              else if (null == s) r.remove(null === o ? void 0 : o);
              else if (null !== o) {
                const a = r.get(o);
                r.move(a, s), $_(a, i);
              }
            });
            for (let i = 0, o = r.length; i < o; i++) {
              const a = r.get(i).context;
              (a.index = i), (a.count = o), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange(i => {
              $_(r.get(i.currentIndex), i);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(L(zt), L(An), L(Ha));
          }),
          (e.ɵdir = Ke({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: { ngForOf: "ngForOf", ngForTrackBy: "ngForTrackBy", ngForTemplate: "ngForTemplate" },
            standalone: !0,
          })),
          e
        );
      })();
      function $_(e, t) {
        e.context.$implicit = t.item;
      }
      let U_ = (() => {
        class e {
          constructor(n, r) {
            (this._viewContainer = n),
              (this._context = new WP()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(n) {
            (this._context.$implicit = this._context.ngIf = n), this._updateView();
          }
          set ngIfThen(n) {
            z_("ngIfThen", n), (this._thenTemplateRef = n), (this._thenViewRef = null), this._updateView();
          }
          set ngIfElse(n) {
            z_("ngIfElse", n), (this._elseTemplateRef = n), (this._elseViewRef = null), this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context)))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context)));
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(L(zt), L(An));
          }),
          (e.ɵdir = Ke({
            type: e,
            selectors: [["", "ngIf", ""]],
            inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
            standalone: !0,
          })),
          e
        );
      })();
      class WP {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function z_(e, t) {
        if (t && !t.createEmbeddedView) throw new Error(`${e} must be a TemplateRef, but received '${Ae(t)}'.`);
      }
      let G_ = (() => {
        class e {
          constructor(n) {
            (this._viewContainerRef = n),
              (this._viewRef = null),
              (this.ngTemplateOutletContext = null),
              (this.ngTemplateOutlet = null),
              (this.ngTemplateOutletInjector = null);
          }
          ngOnChanges(n) {
            if (n.ngTemplateOutlet || n.ngTemplateOutletInjector) {
              const r = this._viewContainerRef;
              if ((this._viewRef && r.remove(r.indexOf(this._viewRef)), this.ngTemplateOutlet)) {
                const { ngTemplateOutlet: i, ngTemplateOutletContext: o, ngTemplateOutletInjector: s } = this;
                this._viewRef = r.createEmbeddedView(i, o, s ? { injector: s } : void 0);
              } else this._viewRef = null;
            } else
              this._viewRef &&
                n.ngTemplateOutletContext &&
                this.ngTemplateOutletContext &&
                (this._viewRef.context = this.ngTemplateOutletContext);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(L(zt));
          }),
          (e.ɵdir = Ke({
            type: e,
            selectors: [["", "ngTemplateOutlet", ""]],
            inputs: {
              ngTemplateOutletContext: "ngTemplateOutletContext",
              ngTemplateOutlet: "ngTemplateOutlet",
              ngTemplateOutletInjector: "ngTemplateOutletInjector",
            },
            standalone: !0,
            features: [ur],
          })),
          e
        );
      })();
      function Wt(e, t) {
        return new D(2100, !1);
      }
      class XP {
        createSubscription(t, n) {
          return t.subscribe({
            next: n,
            error: r => {
              throw r;
            },
          });
        }
        dispose(t) {
          t.unsubscribe();
        }
      }
      class JP {
        createSubscription(t, n) {
          return t.then(n, r => {
            throw r;
          });
        }
        dispose(t) {}
      }
      const ex = new JP(),
        tx = new XP();
      let W_ = (() => {
        class e {
          constructor(n) {
            (this._latestValue = null),
              (this._subscription = null),
              (this._obj = null),
              (this._strategy = null),
              (this._ref = n);
          }
          ngOnDestroy() {
            this._subscription && this._dispose(), (this._ref = null);
          }
          transform(n) {
            return this._obj
              ? n !== this._obj
                ? (this._dispose(), this.transform(n))
                : this._latestValue
              : (n && this._subscribe(n), this._latestValue);
          }
          _subscribe(n) {
            (this._obj = n),
              (this._strategy = this._selectStrategy(n)),
              (this._subscription = this._strategy.createSubscription(n, r => this._updateLatestValue(n, r)));
          }
          _selectStrategy(n) {
            if (Ta(n)) return ex;
            if (by(n)) return tx;
            throw Wt();
          }
          _dispose() {
            this._strategy.dispose(this._subscription),
              (this._latestValue = null),
              (this._subscription = null),
              (this._obj = null);
          }
          _updateLatestValue(n, r) {
            n === this._obj && ((this._latestValue = r), this._ref.markForCheck());
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(L(Od, 16));
          }),
          (e.ɵpipe = rt({ name: "async", type: e, pure: !1, standalone: !0 })),
          e
        );
      })();
      const ax = new A("DATE_PIPE_DEFAULT_TIMEZONE"),
        lx = new A("DATE_PIPE_DEFAULT_OPTIONS");
      let K_ = (() => {
          class e {
            constructor(n, r, i) {
              (this.locale = n), (this.defaultTimezone = r), (this.defaultOptions = i);
            }
            transform(n, r, i, o) {
              if (null == n || "" === n || n != n) return null;
              try {
                return CP(
                  n,
                  r ?? this.defaultOptions?.dateFormat ?? "mediumDate",
                  o || this.locale,
                  i ?? this.defaultOptions?.timezone ?? this.defaultTimezone ?? void 0
                );
              } catch (s) {
                throw Wt();
              }
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(L(Nn, 16), L(ax, 24), L(lx, 24));
            }),
            (e.ɵpipe = rt({ name: "date", type: e, pure: !0, standalone: !0 })),
            e
          );
        })(),
        Z_ = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = en({ type: e })),
            (e.ɵinj = jt({})),
            e
          );
        })();
      function X_(e) {
        return "server" === e;
      }
      let wx = (() => {
        class e {}
        return (e.ɵprov = P({ token: e, providedIn: "root", factory: () => new Ex(M(et), window) })), e;
      })();
      class Ex {
        constructor(t, n) {
          (this.document = t), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling() ? [this.window.pageXOffset, this.window.pageYOffset] : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const n = (function Cx(e, t) {
            const n = e.getElementById(t) || e.getElementsByName(t)[0];
            if (n) return n;
            if ("function" == typeof e.createTreeWalker && e.body && "function" == typeof e.body.attachShadow) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let i = r.currentNode;
              for (; i; ) {
                const o = i.shadowRoot;
                if (o) {
                  const s = o.getElementById(t) || o.querySelector(`[name="${t}"]`);
                  if (s) return s;
                }
                i = r.nextNode();
              }
            }
            return null;
          })(this.document, t);
          n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(t) {
          if (this.supportScrollRestoration()) {
            const n = this.window.history;
            n && n.scrollRestoration && (n.scrollRestoration = t);
          }
        }
        scrollToElement(t) {
          const n = t.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            i = n.top + this.window.pageYOffset,
            o = this.offset();
          this.window.scrollTo(r - o[0], i - o[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const t = J_(this.window.history) || J_(Object.getPrototypeOf(this.window.history));
            return !(!t || (!t.writable && !t.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return !!this.window && !!this.window.scrollTo && "pageXOffset" in this.window;
          } catch {
            return !1;
          }
        }
      }
      function J_(e) {
        return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
      }
      class ew {}
      class Zx extends nP {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class df extends Zx {
        static makeCurrent() {
          !(function tP(e) {
            $d || ($d = e);
          })(new df());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r),
            () => {
              t.removeEventListener(n, r);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n ? window : "document" === n ? t : "body" === n ? t.body : null;
        }
        getBaseHref(t) {
          const n = (function Yx() {
            return (jo = jo || document.querySelector("base")), jo ? jo.getAttribute("href") : null;
          })();
          return null == n
            ? null
            : (function Xx(e) {
                (tl = tl || document.createElement("a")), tl.setAttribute("href", e);
                const t = tl.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          jo = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return j_(document.cookie, t);
        }
      }
      let tl,
        jo = null,
        eO = (() => {
          class e {
            build() {
              return new XMLHttpRequest();
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const ff = new A("EventManagerPlugins");
      let ow = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach(i => {
                i.manager = this;
              }),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, i) {
            return this._findPluginFor(r).addEventListener(n, r, i);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            let r = this._eventNameToPlugin.get(n);
            if (r) return r;
            if (((r = this._plugins.find(o => o.supports(n))), !r)) throw new D(5101, !1);
            return this._eventNameToPlugin.set(n, r), r;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(ff), M(ue));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class sw {
        constructor(t) {
          this._doc = t;
        }
      }
      const hf = "ng-app-id";
      let aw = (() => {
        class e {
          constructor(n, r, i, o = {}) {
            (this.doc = n),
              (this.appId = r),
              (this.nonce = i),
              (this.platformId = o),
              (this.styleRef = new Map()),
              (this.hostNodes = new Set()),
              (this.styleNodesInDOM = this.collectServerRenderedStyles()),
              (this.platformIsServer = X_(o)),
              this.resetHostNodes();
          }
          addStyles(n) {
            for (const r of n) 1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
          }
          removeStyles(n) {
            for (const r of n) this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
          }
          ngOnDestroy() {
            const n = this.styleNodesInDOM;
            n && (n.forEach(r => r.remove()), n.clear());
            for (const r of this.getAllStyles()) this.onStyleRemoved(r);
            this.resetHostNodes();
          }
          addHost(n) {
            this.hostNodes.add(n);
            for (const r of this.getAllStyles()) this.addStyleToHost(n, r);
          }
          removeHost(n) {
            this.hostNodes.delete(n);
          }
          getAllStyles() {
            return this.styleRef.keys();
          }
          onStyleAdded(n) {
            for (const r of this.hostNodes) this.addStyleToHost(r, n);
          }
          onStyleRemoved(n) {
            const r = this.styleRef;
            r.get(n)?.elements?.forEach(i => i.remove()), r.delete(n);
          }
          collectServerRenderedStyles() {
            const n = this.doc.head?.querySelectorAll(`style[${hf}="${this.appId}"]`);
            if (n?.length) {
              const r = new Map();
              return (
                n.forEach(i => {
                  null != i.textContent && r.set(i.textContent, i);
                }),
                r
              );
            }
            return null;
          }
          changeUsageCount(n, r) {
            const i = this.styleRef;
            if (i.has(n)) {
              const o = i.get(n);
              return (o.usage += r), o.usage;
            }
            return i.set(n, { usage: r, elements: [] }), r;
          }
          getStyleElement(n, r) {
            const i = this.styleNodesInDOM,
              o = i?.get(r);
            if (o?.parentNode === n) return i.delete(r), o.removeAttribute(hf), o;
            {
              const s = this.doc.createElement("style");
              return (
                this.nonce && s.setAttribute("nonce", this.nonce),
                (s.textContent = r),
                this.platformIsServer && s.setAttribute(hf, this.appId),
                s
              );
            }
          }
          addStyleToHost(n, r) {
            const i = this.getStyleElement(n, r);
            n.appendChild(i);
            const o = this.styleRef,
              s = o.get(r)?.elements;
            s ? s.push(i) : o.set(r, { elements: [i], usage: 1 });
          }
          resetHostNodes() {
            const n = this.hostNodes;
            n.clear(), n.add(this.doc.head);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(et), M(oa), M(pm, 8), M(pr));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const pf = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        gf = /%COMP%/g,
        iO = new A("RemoveStylesOnCompDestory", { providedIn: "root", factory: () => !1 });
      function uw(e, t) {
        return t.map(n => n.replace(gf, e));
      }
      let mf = (() => {
        class e {
          constructor(n, r, i, o, s, a, l, u = null) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = i),
              (this.removeStylesOnCompDestory = o),
              (this.doc = s),
              (this.platformId = a),
              (this.ngZone = l),
              (this.nonce = u),
              (this.rendererByCompId = new Map()),
              (this.platformIsServer = X_(a)),
              (this.defaultRenderer = new yf(n, s, l, this.platformIsServer));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            this.platformIsServer && r.encapsulation === nt.ShadowDom && (r = { ...r, encapsulation: nt.Emulated });
            const i = this.getOrCreateRenderer(n, r);
            return i instanceof dw ? i.applyToHost(n) : i instanceof vf && i.applyStyles(), i;
          }
          getOrCreateRenderer(n, r) {
            const i = this.rendererByCompId;
            let o = i.get(r.id);
            if (!o) {
              const s = this.doc,
                a = this.ngZone,
                l = this.eventManager,
                u = this.sharedStylesHost,
                c = this.removeStylesOnCompDestory,
                d = this.platformIsServer;
              switch (r.encapsulation) {
                case nt.Emulated:
                  o = new dw(l, u, r, this.appId, c, s, a, d);
                  break;
                case nt.ShadowDom:
                  return new lO(l, u, n, r, s, a, this.nonce, d);
                default:
                  o = new vf(l, u, r, c, s, a, d);
              }
              (o.onDestroy = () => i.delete(r.id)), i.set(r.id, o);
            }
            return o;
          }
          ngOnDestroy() {
            this.rendererByCompId.clear();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(ow), M(aw), M(oa), M(iO), M(et), M(pr), M(ue), M(pm));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class yf {
        constructor(t, n, r, i) {
          (this.eventManager = t),
            (this.doc = n),
            (this.ngZone = r),
            (this.platformIsServer = i),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n ? this.doc.createElementNS(pf[n] || n, t) : this.doc.createElement(t);
        }
        createComment(t) {
          return this.doc.createComment(t);
        }
        createText(t) {
          return this.doc.createTextNode(t);
        }
        appendChild(t, n) {
          (cw(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (cw(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? this.doc.querySelector(t) : t;
          if (!r) throw new D(5104, !1);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, i) {
          if (i) {
            n = i + ":" + n;
            const o = pf[i];
            o ? t.setAttributeNS(o, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const i = pf[r];
            i ? t.removeAttributeNS(i, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, i) {
          i & (ut.DashCase | ut.Important)
            ? t.style.setProperty(n, r, i & ut.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & ut.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          if ("string" == typeof t && !(t = _i().getGlobalEventTarget(this.doc, t)))
            throw new Error(`Unsupported event target ${t} for event ${n}`);
          return this.eventManager.addEventListener(t, n, this.decoratePreventDefault(r));
        }
        decoratePreventDefault(t) {
          return n => {
            if ("__ngUnwrap__" === n) return t;
            !1 === (this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) && n.preventDefault();
          };
        }
      }
      function cw(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class lO extends yf {
        constructor(t, n, r, i, o, s, a, l) {
          super(t, o, s, l),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const u = uw(i.id, i.styles);
          for (const c of u) {
            const d = document.createElement("style");
            a && d.setAttribute("nonce", a), (d.textContent = c), this.shadowRoot.appendChild(d);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
      }
      class vf extends yf {
        constructor(t, n, r, i, o, s, a, l) {
          super(t, o, s, a),
            (this.sharedStylesHost = n),
            (this.removeStylesOnCompDestory = i),
            (this.rendererUsageCount = 0),
            (this.styles = l ? uw(l, r.styles) : r.styles);
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles), this.rendererUsageCount++;
        }
        destroy() {
          this.removeStylesOnCompDestory &&
            (this.sharedStylesHost.removeStyles(this.styles),
            this.rendererUsageCount--,
            0 === this.rendererUsageCount && this.onDestroy?.());
        }
      }
      class dw extends vf {
        constructor(t, n, r, i, o, s, a, l) {
          const u = i + "-" + r.id;
          super(t, n, r, o, s, a, l, u),
            (this.contentAttr = (function oO(e) {
              return "_ngcontent-%COMP%".replace(gf, e);
            })(u)),
            (this.hostAttr = (function sO(e) {
              return "_nghost-%COMP%".replace(gf, e);
            })(u));
        }
        applyToHost(t) {
          this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      let uO = (() => {
        class e extends sw {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, i) {
            return n.addEventListener(r, i, !1), () => this.removeEventListener(n, r, i);
          }
          removeEventListener(n, r, i) {
            return n.removeEventListener(r, i);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(et));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const fw = ["alt", "control", "meta", "shift"],
        cO = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        dO = { alt: e => e.altKey, control: e => e.ctrlKey, meta: e => e.metaKey, shift: e => e.shiftKey };
      let fO = (() => {
        class e extends sw {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, i) {
            const o = e.parseEventName(r),
              s = e.eventCallback(o.fullKey, i, this.manager.getZone());
            return this.manager.getZone().runOutsideAngular(() => _i().onAndCancel(n, o.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              i = r.shift();
            if (0 === r.length || ("keydown" !== i && "keyup" !== i)) return null;
            const o = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              fw.forEach(u => {
                const c = r.indexOf(u);
                c > -1 && (r.splice(c, 1), (s += u + "."));
              }),
              (s += o),
              0 != r.length || 0 === o.length)
            )
              return null;
            const l = {};
            return (l.domEventName = i), (l.fullKey = s), l;
          }
          static matchEventFullKeyCode(n, r) {
            let i = cO[n.key] || n.key,
              o = "";
            return (
              r.indexOf("code.") > -1 && ((i = n.code), (o = "code.")),
              !(null == i || !i) &&
                ((i = i.toLowerCase()),
                " " === i ? (i = "space") : "." === i && (i = "dot"),
                fw.forEach(s => {
                  s !== i && (0, dO[s])(n) && (o += s + ".");
                }),
                (o += i),
                o === r)
            );
          }
          static eventCallback(n, r, i) {
            return o => {
              e.matchEventFullKeyCode(o, n) && i.runGuarded(() => r(o));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(et));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const mO = t_(UR, "browser", [
          { provide: pr, useValue: "browser" },
          {
            provide: fm,
            useValue: function hO() {
              df.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: et,
            useFactory: function gO() {
              return (
                (function yM(e) {
                  Qu = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        yO = new A(""),
        gw = [
          {
            provide: La,
            useClass: class Jx {
              addToWindow(t) {
                (le.getAngularTestability = (r, i = !0) => {
                  const o = t.findTestabilityInTree(r, i);
                  if (null == o) throw new D(5103, !1);
                  return o;
                }),
                  (le.getAllAngularTestabilities = () => t.getAllTestabilities()),
                  (le.getAllAngularRootElements = () => t.getAllRootElements()),
                  le.frameworkStabilizers || (le.frameworkStabilizers = []),
                  le.frameworkStabilizers.push(r => {
                    const i = le.getAllAngularTestabilities();
                    let o = i.length,
                      s = !1;
                    const a = function (l) {
                      (s = s || l), o--, 0 == o && r(s);
                    };
                    i.forEach(function (l) {
                      l.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, n, r) {
                return null == n
                  ? null
                  : t.getTestability(n) ??
                      (r
                        ? _i().isShadowRoot(n)
                          ? this.findTestabilityInTree(t, n.host, !0)
                          : this.findTestabilityInTree(t, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: ZD, useClass: Id, deps: [ue, Ad, La] },
          { provide: Id, useClass: Id, deps: [ue, Ad, La] },
        ],
        mw = [
          { provide: sc, useValue: "root" },
          {
            provide: gr,
            useFactory: function pO() {
              return new gr();
            },
            deps: [],
          },
          { provide: ff, useClass: uO, multi: !0, deps: [et, ue, pr] },
          { provide: ff, useClass: fO, multi: !0, deps: [et] },
          mf,
          aw,
          ow,
          { provide: fo, useExisting: mf },
          { provide: ew, useClass: eO, deps: [] },
          [],
        ];
      let yw = (() => {
          class e {
            constructor(n) {}
            static withServerTransition(n) {
              return { ngModule: e, providers: [{ provide: oa, useValue: n.appId }] };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(yO, 12));
            }),
            (e.ɵmod = en({ type: e })),
            (e.ɵinj = jt({ providers: [...mw, ...gw], imports: [Z_, zR] })),
            e
          );
        })(),
        vw = (() => {
          class e {
            constructor(n) {
              this._doc = n;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(n) {
              this._doc.title = n || "";
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(et));
            }),
            (e.ɵprov = P({
              token: e,
              factory: function (n) {
                let r = null;
                return (
                  (r = n
                    ? new n()
                    : (function DO() {
                        return new vw(M(et));
                      })()),
                  r
                );
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function H(...e) {
        return Oe(e, Li(e));
      }
      typeof window < "u" && window;
      class _t extends yn {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const n = super._subscribe(t);
          return !n.closed && t.next(this._value), n;
        }
        getValue() {
          const { hasError: t, thrownError: n, _value: r } = this;
          if (t) throw n;
          return this._throwIfClosed(), r;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      const { isArray: SO } = Array,
        { getPrototypeOf: MO, prototype: TO, keys: IO } = Object;
      const { isArray: RO } = Array;
      function _f(...e) {
        const t = Li(e),
          n = (function C0(e) {
            return se(ql(e)) ? e.pop() : void 0;
          })(e),
          { args: r, keys: i } = (function AO(e) {
            if (1 === e.length) {
              const t = e[0];
              if (SO(t)) return { args: t, keys: null };
              if (
                (function NO(e) {
                  return e && "object" == typeof e && MO(e) === TO;
                })(t)
              ) {
                const n = IO(t);
                return { args: n.map(r => t[r]), keys: n };
              }
            }
            return { args: e, keys: null };
          })(e);
        if (0 === r.length) return Oe([], t);
        const o = new Ee(
          (function FO(e, t, n = ir) {
            return r => {
              Ew(
                t,
                () => {
                  const { length: i } = e,
                    o = new Array(i);
                  let s = i,
                    a = i;
                  for (let l = 0; l < i; l++)
                    Ew(
                      t,
                      () => {
                        const u = Oe(e[l], t);
                        let c = !1;
                        u.subscribe(
                          je(
                            r,
                            d => {
                              (o[l] = d), c || ((c = !0), a--), a || r.next(n(o.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(
            r,
            t,
            i
              ? s =>
                  (function OO(e, t) {
                    return e.reduce((n, r, i) => ((n[r] = t[i]), n), {});
                  })(i, s)
              : ir
          )
        );
        return n
          ? o.pipe(
              (function xO(e) {
                return te(t =>
                  (function PO(e, t) {
                    return RO(t) ? e(...t) : e(t);
                  })(e, t)
                );
              })(n)
            )
          : o;
      }
      function Ew(e, t, n) {
        e ? vn(n, e, t) : t();
      }
      const nl = Oi(
        e =>
          function () {
            e(this), (this.name = "EmptyError"), (this.message = "no elements in sequence");
          }
      );
      function wf(...e) {
        return (function kO() {
          return Pr(1);
        })()(Oe(e, Li(e)));
      }
      function Cw(e) {
        return new Ee(t => {
          Lt(e()).subscribe(t);
        });
      }
      function Bo(e, t) {
        const n = se(e) ? e : () => e,
          r = i => i.error(n());
        return new Ee(t ? i => t.schedule(r, 0, i) : r);
      }
      function Ef() {
        return Le((e, t) => {
          let n = null;
          e._refCount++;
          const r = je(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount) return void (n = null);
            const i = e._connection,
              o = n;
            (n = null), i && (!o || i === o) && i.unsubscribe(), t.unsubscribe();
          });
          e.subscribe(r), r.closed || (n = e.connect());
        });
      }
      class bw extends Ee {
        constructor(t, n) {
          super(),
            (this.source = t),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            Nh(t) && (this.lift = t.lift);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (!t || t.isStopped) && (this._subject = this.subjectFactory()), this._subject;
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: t } = this;
          (this._subject = this._connection = null), t?.unsubscribe();
        }
        connect() {
          let t = this._connection;
          if (!t) {
            t = this._connection = new St();
            const n = this.getSubject();
            t.add(
              this.source.subscribe(
                je(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  r => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              t.closed && ((this._connection = null), (t = St.EMPTY));
          }
          return t;
        }
        refCount() {
          return Ef()(this);
        }
      }
      function fn(e, t) {
        return Le((n, r) => {
          let i = null,
            o = 0,
            s = !1;
          const a = () => s && !i && r.complete();
          n.subscribe(
            je(
              r,
              l => {
                i?.unsubscribe();
                let u = 0;
                const c = o++;
                Lt(e(l, c)).subscribe(
                  (i = je(
                    r,
                    d => r.next(t ? t(l, d, c, u++) : d),
                    () => {
                      (i = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function wi(e) {
        return e <= 0
          ? () => Yt
          : Le((t, n) => {
              let r = 0;
              t.subscribe(
                je(n, i => {
                  ++r <= e && (n.next(i), e <= r && n.complete());
                })
              );
            });
      }
      function xn(e, t) {
        return Le((n, r) => {
          let i = 0;
          n.subscribe(je(r, o => e.call(t, o, i++) && r.next(o)));
        });
      }
      function rl(e) {
        return Le((t, n) => {
          let r = !1;
          t.subscribe(
            je(
              n,
              i => {
                (r = !0), n.next(i);
              },
              () => {
                r || n.next(e), n.complete();
              }
            )
          );
        });
      }
      function Sw(e = jO) {
        return Le((t, n) => {
          let r = !1;
          t.subscribe(
            je(
              n,
              i => {
                (r = !0), n.next(i);
              },
              () => (r ? n.complete() : n.error(e()))
            )
          );
        });
      }
      function jO() {
        return new nl();
      }
      function Er(e, t) {
        const n = arguments.length >= 2;
        return r => r.pipe(e ? xn((i, o) => e(i, o, r)) : ir, wi(1), n ? rl(t) : Sw(() => new nl()));
      }
      function Ei(e, t) {
        return se(t) ? Be(e, t, 1) : Be(e, 1);
      }
      function $e(e, t, n) {
        const r = se(e) || t || n ? { next: e, error: t, complete: n } : e;
        return r
          ? Le((i, o) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              i.subscribe(
                je(
                  o,
                  l => {
                    var u;
                    null === (u = r.next) || void 0 === u || u.call(r, l), o.next(l);
                  },
                  () => {
                    var l;
                    (a = !1), null === (l = r.complete) || void 0 === l || l.call(r), o.complete();
                  },
                  l => {
                    var u;
                    (a = !1), null === (u = r.error) || void 0 === u || u.call(r, l), o.error(l);
                  },
                  () => {
                    var l, u;
                    a && (null === (l = r.unsubscribe) || void 0 === l || l.call(r)),
                      null === (u = r.finalize) || void 0 === u || u.call(r);
                  }
                )
              );
            })
          : ir;
      }
      function Cr(e) {
        return Le((t, n) => {
          let o,
            r = null,
            i = !1;
          (r = t.subscribe(
            je(n, void 0, void 0, s => {
              (o = Lt(e(s, Cr(e)(t)))), r ? (r.unsubscribe(), (r = null), o.subscribe(n)) : (i = !0);
            })
          )),
            i && (r.unsubscribe(), (r = null), o.subscribe(n));
        });
      }
      function Cf(e) {
        return e <= 0
          ? () => Yt
          : Le((t, n) => {
              let r = [];
              t.subscribe(
                je(
                  n,
                  i => {
                    r.push(i), e < r.length && r.shift();
                  },
                  () => {
                    for (const i of r) n.next(i);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function bf(e) {
        return Le((t, n) => {
          try {
            t.subscribe(n);
          } finally {
            n.add(e);
          }
        });
      }
      const W = "primary",
        Vo = Symbol("RouteTitle");
      class UO {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function Ci(e) {
        return new UO(e);
      }
      function zO(e, t, n) {
        const r = n.path.split("/");
        if (r.length > e.length || ("full" === n.pathMatch && (t.hasChildren() || r.length < e.length))) return null;
        const i = {};
        for (let o = 0; o < r.length; o++) {
          const s = r[o],
            a = e[o];
          if (s.startsWith(":")) i[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: i };
      }
      function hn(e, t) {
        const n = e ? Object.keys(e) : void 0,
          r = t ? Object.keys(t) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let i;
        for (let o = 0; o < n.length; o++) if (((i = n[o]), !Mw(e[i], t[i]))) return !1;
        return !0;
      }
      function Mw(e, t) {
        if (Array.isArray(e) && Array.isArray(t)) {
          if (e.length !== t.length) return !1;
          const n = [...e].sort(),
            r = [...t].sort();
          return n.every((i, o) => r[o] === i);
        }
        return e === t;
      }
      function Tw(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function Yn(e) {
        return (function bO(e) {
          return !!e && (e instanceof Ee || (se(e.lift) && se(e.subscribe)));
        })(e)
          ? e
          : Ta(e)
          ? Oe(Promise.resolve(e))
          : H(e);
      }
      const GO = {
          exact: function Nw(e, t, n) {
            if (
              !br(e.segments, t.segments) ||
              !il(e.segments, t.segments, n) ||
              e.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const r in t.children) if (!e.children[r] || !Nw(e.children[r], t.children[r], n)) return !1;
            return !0;
          },
          subset: Rw,
        },
        Iw = {
          exact: function WO(e, t) {
            return hn(e, t);
          },
          subset: function KO(e, t) {
            return Object.keys(t).length <= Object.keys(e).length && Object.keys(t).every(n => Mw(e[n], t[n]));
          },
          ignored: () => !0,
        };
      function Aw(e, t, n) {
        return (
          GO[n.paths](e.root, t.root, n.matrixParams) &&
          Iw[n.queryParams](e.queryParams, t.queryParams) &&
          !("exact" === n.fragment && e.fragment !== t.fragment)
        );
      }
      function Rw(e, t, n) {
        return Pw(e, t, t.segments, n);
      }
      function Pw(e, t, n, r) {
        if (e.segments.length > n.length) {
          const i = e.segments.slice(0, n.length);
          return !(!br(i, n) || t.hasChildren() || !il(i, n, r));
        }
        if (e.segments.length === n.length) {
          if (!br(e.segments, n) || !il(e.segments, n, r)) return !1;
          for (const i in t.children) if (!e.children[i] || !Rw(e.children[i], t.children[i], r)) return !1;
          return !0;
        }
        {
          const i = n.slice(0, e.segments.length),
            o = n.slice(e.segments.length);
          return !!(br(e.segments, i) && il(e.segments, i, r) && e.children[W]) && Pw(e.children[W], t, o, r);
        }
      }
      function il(e, t, n) {
        return t.every((r, i) => Iw[n](e[i].parameters, r.parameters));
      }
      class bi {
        constructor(t = new oe([], {}), n = {}, r = null) {
          (this.root = t), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return this._queryParamMap || (this._queryParamMap = Ci(this.queryParams)), this._queryParamMap;
        }
        toString() {
          return YO.serialize(this);
        }
      }
      class oe {
        constructor(t, n) {
          (this.segments = t),
            (this.children = n),
            (this.parent = null),
            Object.values(n).forEach(r => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return ol(this);
        }
      }
      class Ho {
        constructor(t, n) {
          (this.path = t), (this.parameters = n);
        }
        get parameterMap() {
          return this._parameterMap || (this._parameterMap = Ci(this.parameters)), this._parameterMap;
        }
        toString() {
          return Fw(this);
        }
      }
      function br(e, t) {
        return e.length === t.length && e.every((n, r) => n.path === t[r].path);
      }
      let $o = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({
            token: e,
            factory: function () {
              return new Sf();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      class Sf {
        parse(t) {
          const n = new lF(t);
          return new bi(n.parseRootSegment(), n.parseQueryParams(), n.parseFragment());
        }
        serialize(t) {
          const n = `/${Uo(t.root, !0)}`,
            r = (function eF(e) {
              const t = Object.keys(e)
                .map(n => {
                  const r = e[n];
                  return Array.isArray(r) ? r.map(i => `${sl(n)}=${sl(i)}`).join("&") : `${sl(n)}=${sl(r)}`;
                })
                .filter(n => !!n);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams);
          return `${n}${r}${
            "string" == typeof t.fragment
              ? `#${(function XO(e) {
                  return encodeURI(e);
                })(t.fragment)}`
              : ""
          }`;
        }
      }
      const YO = new Sf();
      function ol(e) {
        return e.segments.map(t => Fw(t)).join("/");
      }
      function Uo(e, t) {
        if (!e.hasChildren()) return ol(e);
        if (t) {
          const n = e.children[W] ? Uo(e.children[W], !1) : "",
            r = [];
          return (
            Object.entries(e.children).forEach(([i, o]) => {
              i !== W && r.push(`${i}:${Uo(o, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function ZO(e, t) {
            let n = [];
            return (
              Object.entries(e.children).forEach(([r, i]) => {
                r === W && (n = n.concat(t(i, r)));
              }),
              Object.entries(e.children).forEach(([r, i]) => {
                r !== W && (n = n.concat(t(i, r)));
              }),
              n
            );
          })(e, (r, i) => (i === W ? [Uo(e.children[W], !1)] : [`${i}:${Uo(r, !1)}`]));
          return 1 === Object.keys(e.children).length && null != e.children[W]
            ? `${ol(e)}/${n[0]}`
            : `${ol(e)}/(${n.join("//")})`;
        }
      }
      function xw(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function sl(e) {
        return xw(e).replace(/%3B/gi, ";");
      }
      function Mf(e) {
        return xw(e).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&");
      }
      function al(e) {
        return decodeURIComponent(e);
      }
      function Ow(e) {
        return al(e.replace(/\+/g, "%20"));
      }
      function Fw(e) {
        return `${Mf(e.path)}${(function JO(e) {
          return Object.keys(e)
            .map(t => `;${Mf(t)}=${Mf(e[t])}`)
            .join("");
        })(e.parameters)}`;
      }
      const tF = /^[^\/()?;#]+/;
      function Tf(e) {
        const t = e.match(tF);
        return t ? t[0] : "";
      }
      const nF = /^[^\/()?;=#]+/,
        iF = /^[^=?&#]+/,
        sF = /^[^&#]+/;
      class lF {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining || this.peekStartsWith("?") || this.peekStartsWith("#")
              ? new oe([], {})
              : new oe([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") && (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(n).length > 0) && (r[W] = new oe(t, n)),
            r
          );
        }
        parseSegment() {
          const t = Tf(this.remaining);
          if ("" === t && this.peekStartsWith(";")) throw new D(4009, !1);
          return this.capture(t), new Ho(al(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const n = (function rF(e) {
            const t = e.match(nF);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const i = Tf(this.remaining);
            i && ((r = i), this.capture(r));
          }
          t[al(n)] = al(r);
        }
        parseQueryParam(t) {
          const n = (function oF(e) {
            const t = e.match(iF);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function aF(e) {
              const t = e.match(sF);
              return t ? t[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const i = Ow(n),
            o = Ow(r);
          if (t.hasOwnProperty(i)) {
            let s = t[i];
            Array.isArray(s) || ((s = [s]), (t[i] = s)), s.push(o);
          } else t[i] = o;
        }
        parseParens(t) {
          const n = {};
          for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0; ) {
            const r = Tf(this.remaining),
              i = this.remaining[r.length];
            if ("/" !== i && ")" !== i && ";" !== i) throw new D(4010, !1);
            let o;
            r.indexOf(":") > -1 ? ((o = r.slice(0, r.indexOf(":"))), this.capture(o), this.capture(":")) : t && (o = W);
            const s = this.parseChildren();
            (n[o] = 1 === Object.keys(s).length ? s[W] : new oe([], s)), this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return !!this.peekStartsWith(t) && ((this.remaining = this.remaining.substring(t.length)), !0);
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new D(4011, !1);
        }
      }
      function kw(e) {
        return e.segments.length > 0 ? new oe([], { [W]: e }) : e;
      }
      function Lw(e) {
        const t = {};
        for (const r of Object.keys(e.children)) {
          const o = Lw(e.children[r]);
          if (r === W && 0 === o.segments.length && o.hasChildren())
            for (const [s, a] of Object.entries(o.children)) t[s] = a;
          else (o.segments.length > 0 || o.hasChildren()) && (t[r] = o);
        }
        return (function uF(e) {
          if (1 === e.numberOfChildren && e.children[W]) {
            const t = e.children[W];
            return new oe(e.segments.concat(t.segments), t.children);
          }
          return e;
        })(new oe(e.segments, t));
      }
      function Sr(e) {
        return e instanceof bi;
      }
      function jw(e) {
        let t;
        const i = kw(
          (function n(o) {
            const s = {};
            for (const l of o.children) {
              const u = n(l);
              s[l.outlet] = u;
            }
            const a = new oe(o.url, s);
            return o === e && (t = a), a;
          })(e.root)
        );
        return t ?? i;
      }
      function Bw(e, t, n, r) {
        let i = e;
        for (; i.parent; ) i = i.parent;
        if (0 === t.length) return If(i, i, i, n, r);
        const o = (function dF(e) {
          if ("string" == typeof e[0] && 1 === e.length && "/" === e[0]) return new Hw(!0, 0, e);
          let t = 0,
            n = !1;
          const r = e.reduce((i, o, s) => {
            if ("object" == typeof o && null != o) {
              if (o.outlets) {
                const a = {};
                return (
                  Object.entries(o.outlets).forEach(([l, u]) => {
                    a[l] = "string" == typeof u ? u.split("/") : u;
                  }),
                  [...i, { outlets: a }]
                );
              }
              if (o.segmentPath) return [...i, o.segmentPath];
            }
            return "string" != typeof o
              ? [...i, o]
              : 0 === s
              ? (o.split("/").forEach((a, l) => {
                  (0 == l && "." === a) || (0 == l && "" === a ? (n = !0) : ".." === a ? t++ : "" != a && i.push(a));
                }),
                i)
              : [...i, o];
          }, []);
          return new Hw(n, t, r);
        })(t);
        if (o.toRoot()) return If(i, i, new oe([], {}), n, r);
        const s = (function fF(e, t, n) {
            if (e.isAbsolute) return new ul(t, !0, 0);
            if (!n) return new ul(t, !1, NaN);
            if (null === n.parent) return new ul(n, !0, 0);
            const r = ll(e.commands[0]) ? 0 : 1;
            return (function hF(e, t, n) {
              let r = e,
                i = t,
                o = n;
              for (; o > i; ) {
                if (((o -= i), (r = r.parent), !r)) throw new D(4005, !1);
                i = r.segments.length;
              }
              return new ul(r, !1, i - o);
            })(n, n.segments.length - 1 + r, e.numberOfDoubleDots);
          })(o, i, e),
          a = s.processChildren ? qo(s.segmentGroup, s.index, o.commands) : $w(s.segmentGroup, s.index, o.commands);
        return If(i, s.segmentGroup, a, n, r);
      }
      function ll(e) {
        return "object" == typeof e && null != e && !e.outlets && !e.segmentPath;
      }
      function zo(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function If(e, t, n, r, i) {
        let s,
          o = {};
        r &&
          Object.entries(r).forEach(([l, u]) => {
            o[l] = Array.isArray(u) ? u.map(c => `${c}`) : `${u}`;
          }),
          (s = e === t ? n : Vw(e, t, n));
        const a = kw(Lw(s));
        return new bi(a, o, i);
      }
      function Vw(e, t, n) {
        const r = {};
        return (
          Object.entries(e.children).forEach(([i, o]) => {
            r[i] = o === t ? n : Vw(o, t, n);
          }),
          new oe(e.segments, r)
        );
      }
      class Hw {
        constructor(t, n, r) {
          if (
            ((this.isAbsolute = t), (this.numberOfDoubleDots = n), (this.commands = r), t && r.length > 0 && ll(r[0]))
          )
            throw new D(4003, !1);
          const i = r.find(zo);
          if (i && i !== Tw(r)) throw new D(4004, !1);
        }
        toRoot() {
          return this.isAbsolute && 1 === this.commands.length && "/" == this.commands[0];
        }
      }
      class ul {
        constructor(t, n, r) {
          (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
        }
      }
      function $w(e, t, n) {
        if ((e || (e = new oe([], {})), 0 === e.segments.length && e.hasChildren())) return qo(e, t, n);
        const r = (function gF(e, t, n) {
            let r = 0,
              i = t;
            const o = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; i < e.segments.length; ) {
              if (r >= n.length) return o;
              const s = e.segments[i],
                a = n[r];
              if (zo(a)) break;
              const l = `${a}`,
                u = r < n.length - 1 ? n[r + 1] : null;
              if (i > 0 && void 0 === l) break;
              if (l && u && "object" == typeof u && void 0 === u.outlets) {
                if (!zw(l, u, s)) return o;
                r += 2;
              } else {
                if (!zw(l, {}, s)) return o;
                r++;
              }
              i++;
            }
            return { match: !0, pathIndex: i, commandIndex: r };
          })(e, t, n),
          i = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const o = new oe(e.segments.slice(0, r.pathIndex), {});
          return (o.children[W] = new oe(e.segments.slice(r.pathIndex), e.children)), qo(o, 0, i);
        }
        return r.match && 0 === i.length
          ? new oe(e.segments, {})
          : r.match && !e.hasChildren()
          ? Af(e, t, n)
          : r.match
          ? qo(e, 0, i)
          : Af(e, t, n);
      }
      function qo(e, t, n) {
        if (0 === n.length) return new oe(e.segments, {});
        {
          const r = (function pF(e) {
              return zo(e[0]) ? e[0].outlets : { [W]: e };
            })(n),
            i = {};
          if (!r[W] && e.children[W] && 1 === e.numberOfChildren && 0 === e.children[W].segments.length) {
            const o = qo(e.children[W], t, n);
            return new oe(e.segments, o.children);
          }
          return (
            Object.entries(r).forEach(([o, s]) => {
              "string" == typeof s && (s = [s]), null !== s && (i[o] = $w(e.children[o], t, s));
            }),
            Object.entries(e.children).forEach(([o, s]) => {
              void 0 === r[o] && (i[o] = s);
            }),
            new oe(e.segments, i)
          );
        }
      }
      function Af(e, t, n) {
        const r = e.segments.slice(0, t);
        let i = 0;
        for (; i < n.length; ) {
          const o = n[i];
          if (zo(o)) {
            const l = mF(o.outlets);
            return new oe(r, l);
          }
          if (0 === i && ll(n[0])) {
            r.push(new Ho(e.segments[t].path, Uw(n[0]))), i++;
            continue;
          }
          const s = zo(o) ? o.outlets[W] : `${o}`,
            a = i < n.length - 1 ? n[i + 1] : null;
          s && a && ll(a) ? (r.push(new Ho(s, Uw(a))), (i += 2)) : (r.push(new Ho(s, {})), i++);
        }
        return new oe(r, {});
      }
      function mF(e) {
        const t = {};
        return (
          Object.entries(e).forEach(([n, r]) => {
            "string" == typeof r && (r = [r]), null !== r && (t[n] = Af(new oe([], {}), 0, r));
          }),
          t
        );
      }
      function Uw(e) {
        const t = {};
        return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t;
      }
      function zw(e, t, n) {
        return e == n.path && hn(t, n.parameters);
      }
      const Go = "imperative";
      class pn {
        constructor(t, n) {
          (this.id = t), (this.url = n);
        }
      }
      class Nf extends pn {
        constructor(t, n, r = "imperative", i = null) {
          super(t, n), (this.type = 0), (this.navigationTrigger = r), (this.restoredState = i);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Mr extends pn {
        constructor(t, n, r) {
          super(t, n), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class cl extends pn {
        constructor(t, n, r, i) {
          super(t, n), (this.reason = r), (this.code = i), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Wo extends pn {
        constructor(t, n, r, i) {
          super(t, n), (this.reason = r), (this.code = i), (this.type = 16);
        }
      }
      class Rf extends pn {
        constructor(t, n, r, i) {
          super(t, n), (this.error = r), (this.target = i), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class yF extends pn {
        constructor(t, n, r, i) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = i), (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class vF extends pn {
        constructor(t, n, r, i) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = i), (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class DF extends pn {
        constructor(t, n, r, i, o) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = i), (this.shouldActivate = o), (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class _F extends pn {
        constructor(t, n, r, i) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = i), (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class wF extends pn {
        constructor(t, n, r, i) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = i), (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class EF {
        constructor(t) {
          (this.route = t), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class CF {
        constructor(t) {
          (this.route = t), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class bF {
        constructor(t) {
          (this.snapshot = t), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
      }
      class SF {
        constructor(t) {
          (this.snapshot = t), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
      }
      class MF {
        constructor(t) {
          (this.snapshot = t), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
      }
      class TF {
        constructor(t) {
          (this.snapshot = t), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
      }
      class qw {
        constructor(t, n, r) {
          (this.routerEvent = t), (this.position = n), (this.anchor = r), (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class IF {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.injector = null),
            (this.children = new Ko()),
            (this.attachRef = null);
        }
      }
      let Ko = (() => {
        class e {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(n, r) {
            const i = this.getOrCreateContext(n);
            (i.outlet = r), this.contexts.set(n, i);
          }
          onChildOutletDestroyed(n) {
            const r = this.getContext(n);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const n = this.contexts;
            return (this.contexts = new Map()), n;
          }
          onOutletReAttached(n) {
            this.contexts = n;
          }
          getOrCreateContext(n) {
            let r = this.getContext(n);
            return r || ((r = new IF()), this.contexts.set(n, r)), r;
          }
          getContext(n) {
            return this.contexts.get(n) || null;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      class Gw {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const n = this.pathFromRoot(t);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(t) {
          const n = Pf(t, this._root);
          return n ? n.children.map(r => r.value) : [];
        }
        firstChild(t) {
          const n = Pf(t, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(t) {
          const n = xf(t, this._root);
          return n.length < 2 ? [] : n[n.length - 2].children.map(i => i.value).filter(i => i !== t);
        }
        pathFromRoot(t) {
          return xf(t, this._root).map(n => n.value);
        }
      }
      function Pf(e, t) {
        if (e === t.value) return t;
        for (const n of t.children) {
          const r = Pf(e, n);
          if (r) return r;
        }
        return null;
      }
      function xf(e, t) {
        if (e === t.value) return [t];
        for (const n of t.children) {
          const r = xf(e, n);
          if (r.length) return r.unshift(t), r;
        }
        return [];
      }
      class On {
        constructor(t, n) {
          (this.value = t), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function Si(e) {
        const t = {};
        return e && e.children.forEach(n => (t[n.value.outlet] = n)), t;
      }
      class Ww extends Gw {
        constructor(t, n) {
          super(t), (this.snapshot = n), Of(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function Kw(e, t) {
        const n = (function AF(e, t) {
            const s = new dl([], {}, {}, "", {}, W, t, null, {});
            return new Zw("", new On(s, []));
          })(0, t),
          r = new _t([new Ho("", {})]),
          i = new _t({}),
          o = new _t({}),
          s = new _t({}),
          a = new _t(""),
          l = new Mi(r, i, s, a, o, W, t, n.root);
        return (l.snapshot = n.root), new Ww(new On(l, []), n);
      }
      class Mi {
        constructor(t, n, r, i, o, s, a, l) {
          (this.urlSubject = t),
            (this.paramsSubject = n),
            (this.queryParamsSubject = r),
            (this.fragmentSubject = i),
            (this.dataSubject = o),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = l),
            (this.title = this.dataSubject?.pipe(te(u => u[Vo])) ?? H(void 0)),
            (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return this._paramMap || (this._paramMap = this.params.pipe(te(t => Ci(t)))), this._paramMap;
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = this.queryParams.pipe(te(t => Ci(t)))), this._queryParamMap
          );
        }
        toString() {
          return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
        }
      }
      function Qw(e, t = "emptyOnly") {
        const n = e.pathFromRoot;
        let r = 0;
        if ("always" !== t)
          for (r = n.length - 1; r >= 1; ) {
            const i = n[r],
              o = n[r - 1];
            if (i.routeConfig && "" === i.routeConfig.path) r--;
            else {
              if (o.component) break;
              r--;
            }
          }
        return (function NF(e) {
          return e.reduce(
            (t, n) => ({
              params: { ...t.params, ...n.params },
              data: { ...t.data, ...n.data },
              resolve: { ...n.data, ...t.resolve, ...n.routeConfig?.data, ...n._resolvedData },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(n.slice(r));
      }
      class dl {
        get title() {
          return this.data?.[Vo];
        }
        constructor(t, n, r, i, o, s, a, l, u) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = l),
            (this._resolve = u);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return this._paramMap || (this._paramMap = Ci(this.params)), this._paramMap;
        }
        get queryParamMap() {
          return this._queryParamMap || (this._queryParamMap = Ci(this.queryParams)), this._queryParamMap;
        }
        toString() {
          return `Route(url:'${this.url.map(r => r.toString()).join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class Zw extends Gw {
        constructor(t, n) {
          super(n), (this.url = t), Of(this, n);
        }
        toString() {
          return Yw(this._root);
        }
      }
      function Of(e, t) {
        (t.value._routerState = e), t.children.forEach(n => Of(e, n));
      }
      function Yw(e) {
        const t = e.children.length > 0 ? ` { ${e.children.map(Yw).join(", ")} } ` : "";
        return `${e.value}${t}`;
      }
      function Ff(e) {
        if (e.snapshot) {
          const t = e.snapshot,
            n = e._futureSnapshot;
          (e.snapshot = n),
            hn(t.queryParams, n.queryParams) || e.queryParamsSubject.next(n.queryParams),
            t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
            hn(t.params, n.params) || e.paramsSubject.next(n.params),
            (function qO(e, t) {
              if (e.length !== t.length) return !1;
              for (let n = 0; n < e.length; ++n) if (!hn(e[n], t[n])) return !1;
              return !0;
            })(t.url, n.url) || e.urlSubject.next(n.url),
            hn(t.data, n.data) || e.dataSubject.next(n.data);
        } else (e.snapshot = e._futureSnapshot), e.dataSubject.next(e._futureSnapshot.data);
      }
      function kf(e, t) {
        const n =
          hn(e.params, t.params) &&
          (function QO(e, t) {
            return br(e, t) && e.every((n, r) => hn(n.parameters, t[r].parameters));
          })(e.url, t.url);
        return n && !(!e.parent != !t.parent) && (!e.parent || kf(e.parent, t.parent));
      }
      let Xw = (() => {
        class e {
          constructor() {
            (this.activated = null),
              (this._activatedRoute = null),
              (this.name = W),
              (this.activateEvents = new Xe()),
              (this.deactivateEvents = new Xe()),
              (this.attachEvents = new Xe()),
              (this.detachEvents = new Xe()),
              (this.parentContexts = I(Ko)),
              (this.location = I(zt)),
              (this.changeDetector = I(Od)),
              (this.environmentInjector = I(ln)),
              (this.inputBinder = I(fl, { optional: !0 })),
              (this.supportsBindingToComponentInputs = !0);
          }
          get activatedComponentRef() {
            return this.activated;
          }
          ngOnChanges(n) {
            if (n.name) {
              const { firstChange: r, previousValue: i } = n.name;
              if (r) return;
              this.isTrackedInParentContexts(i) && (this.deactivate(), this.parentContexts.onChildOutletDestroyed(i)),
                this.initializeOutletWithName();
            }
          }
          ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) && this.parentContexts.onChildOutletDestroyed(this.name),
              this.inputBinder?.unsubscribeFromRouteData(this);
          }
          isTrackedInParentContexts(n) {
            return this.parentContexts.getContext(n)?.outlet === this;
          }
          ngOnInit() {
            this.initializeOutletWithName();
          }
          initializeOutletWithName() {
            if ((this.parentContexts.onChildOutletCreated(this.name, this), this.activated)) return;
            const n = this.parentContexts.getContext(this.name);
            n?.route && (n.attachRef ? this.attach(n.attachRef, n.route) : this.activateWith(n.route, n.injector));
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new D(4012, !1);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new D(4012, !1);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
          }
          detach() {
            if (!this.activated) throw new D(4012, !1);
            this.location.detach();
            const n = this.activated;
            return (this.activated = null), (this._activatedRoute = null), this.detachEvents.emit(n.instance), n;
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated) throw new D(4013, !1);
            this._activatedRoute = n;
            const i = this.location,
              s = n.snapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new RF(n, a, i.injector);
            (this.activated = i.createComponent(s, {
              index: i.length,
              injector: l,
              environmentInjector: r ?? this.environmentInjector,
            })),
              this.changeDetector.markForCheck(),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵdir = Ke({
            type: e,
            selectors: [["router-outlet"]],
            inputs: { name: "name" },
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
            features: [ur],
          })),
          e
        );
      })();
      class RF {
        constructor(t, n, r) {
          (this.route = t), (this.childContexts = n), (this.parent = r);
        }
        get(t, n) {
          return t === Mi ? this.route : t === Ko ? this.childContexts : this.parent.get(t, n);
        }
      }
      const fl = new A("");
      let Jw = (() => {
        class e {
          constructor() {
            this.outletDataSubscriptions = new Map();
          }
          bindActivatedRouteToOutletComponent(n) {
            this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
          }
          unsubscribeFromRouteData(n) {
            this.outletDataSubscriptions.get(n)?.unsubscribe(), this.outletDataSubscriptions.delete(n);
          }
          subscribeToRouteData(n) {
            const { activatedRoute: r } = n,
              i = _f([r.queryParams, r.params, r.data])
                .pipe(fn(([o, s, a], l) => ((a = { ...o, ...s, ...a }), 0 === l ? H(a) : Promise.resolve(a))))
                .subscribe(o => {
                  if (!n.isActivated || !n.activatedComponentRef || n.activatedRoute !== r || null === r.component)
                    return void this.unsubscribeFromRouteData(n);
                  const s = (function eP(e) {
                    const t = ee(e);
                    if (!t) return null;
                    const n = new yo(t);
                    return {
                      get selector() {
                        return n.selector;
                      },
                      get type() {
                        return n.componentType;
                      },
                      get inputs() {
                        return n.inputs;
                      },
                      get outputs() {
                        return n.outputs;
                      },
                      get ngContentSelectors() {
                        return n.ngContentSelectors;
                      },
                      get isStandalone() {
                        return t.standalone;
                      },
                    };
                  })(r.component);
                  if (s) for (const { templateName: a } of s.inputs) n.activatedComponentRef.setInput(a, o[a]);
                  else this.unsubscribeFromRouteData(n);
                });
            this.outletDataSubscriptions.set(n, i);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function Qo(e, t, n) {
        if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = t.value;
          const i = (function xF(e, t, n) {
            return t.children.map(r => {
              for (const i of n.children) if (e.shouldReuseRoute(r.value, i.value.snapshot)) return Qo(e, r, i);
              return Qo(e, r);
            });
          })(e, t, n);
          return new On(r, i);
        }
        {
          if (e.shouldAttach(t.value)) {
            const o = e.retrieve(t.value);
            if (null !== o) {
              const s = o.route;
              return (s.value._futureSnapshot = t.value), (s.children = t.children.map(a => Qo(e, a))), s;
            }
          }
          const r = (function OF(e) {
              return new Mi(
                new _t(e.url),
                new _t(e.params),
                new _t(e.queryParams),
                new _t(e.fragment),
                new _t(e.data),
                e.outlet,
                e.component,
                e
              );
            })(t.value),
            i = t.children.map(o => Qo(e, o));
          return new On(r, i);
        }
      }
      const Lf = "ngNavigationCancelingError";
      function eE(e, t) {
        const { redirectTo: n, navigationBehaviorOptions: r } = Sr(t)
            ? { redirectTo: t, navigationBehaviorOptions: void 0 }
            : t,
          i = tE(!1, 0, t);
        return (i.url = n), (i.navigationBehaviorOptions = r), i;
      }
      function tE(e, t, n) {
        const r = new Error("NavigationCancelingError: " + (e || ""));
        return (r[Lf] = !0), (r.cancellationCode = t), n && (r.url = n), r;
      }
      function nE(e) {
        return rE(e) && Sr(e.url);
      }
      function rE(e) {
        return e && e[Lf];
      }
      let iE = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵcmp = Jt({
            type: e,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [Qv],
            decls: 1,
            vars: 0,
            template: function (n, r) {
              1 & n && ae(0, "router-outlet");
            },
            dependencies: [Xw],
            encapsulation: 2,
          })),
          e
        );
      })();
      function jf(e) {
        const t = e.children && e.children.map(jf),
          n = t ? { ...e, children: t } : { ...e };
        return (
          !n.component && !n.loadComponent && (t || n.loadChildren) && n.outlet && n.outlet !== W && (n.component = iE),
          n
        );
      }
      function Kt(e) {
        return e.outlet || W;
      }
      function Zo(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let t = e.parent; t; t = t.parent) {
          const n = t.routeConfig;
          if (n?._loadedInjector) return n._loadedInjector;
          if (n?._injector) return n._injector;
        }
        return null;
      }
      class HF {
        constructor(t, n, r, i, o) {
          (this.routeReuseStrategy = t),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = i),
            (this.inputBindingEnabled = o);
        }
        activate(t) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, t), Ff(this.futureState.root), this.activateChildRoutes(n, r, t);
        }
        deactivateChildRoutes(t, n, r) {
          const i = Si(n);
          t.children.forEach(o => {
            const s = o.value.outlet;
            this.deactivateRoutes(o, i[s], r), delete i[s];
          }),
            Object.values(i).forEach(o => {
              this.deactivateRouteAndItsChildren(o, r);
            });
        }
        deactivateRoutes(t, n, r) {
          const i = t.value,
            o = n ? n.value : null;
          if (i === o)
            if (i.component) {
              const s = r.getContext(i.outlet);
              s && this.deactivateChildRoutes(t, n, s.children);
            } else this.deactivateChildRoutes(t, n, r);
          else o && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(t, n) {
          t.value.component && this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, n)
            : this.deactivateRouteAndOutlet(t, n);
        }
        detachAndStoreRouteSubtree(t, n) {
          const r = n.getContext(t.value.outlet),
            i = r && t.value.component ? r.children : n,
            o = Si(t);
          for (const s of Object.keys(o)) this.deactivateRouteAndItsChildren(o[s], i);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, { componentRef: s, route: t, contexts: a });
          }
        }
        deactivateRouteAndOutlet(t, n) {
          const r = n.getContext(t.value.outlet),
            i = r && t.value.component ? r.children : n,
            o = Si(t);
          for (const s of Object.keys(o)) this.deactivateRouteAndItsChildren(o[s], i);
          r &&
            (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
            (r.attachRef = null),
            (r.route = null));
        }
        activateChildRoutes(t, n, r) {
          const i = Si(n);
          t.children.forEach(o => {
            this.activateRoutes(o, i[o.value.outlet], r), this.forwardEvent(new TF(o.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new SF(t.value.snapshot));
        }
        activateRoutes(t, n, r) {
          const i = t.value,
            o = n ? n.value : null;
          if ((Ff(i), i === o))
            if (i.component) {
              const s = r.getOrCreateContext(i.outlet);
              this.activateChildRoutes(t, n, s.children);
            } else this.activateChildRoutes(t, n, r);
          else if (i.component) {
            const s = r.getOrCreateContext(i.outlet);
            if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(i.snapshot);
              this.routeReuseStrategy.store(i.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Ff(a.route.value),
                this.activateChildRoutes(t, null, s.children);
            } else {
              const a = Zo(i.snapshot);
              (s.attachRef = null),
                (s.route = i),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(i, s.injector),
                this.activateChildRoutes(t, null, s.children);
            }
          } else this.activateChildRoutes(t, null, r);
        }
      }
      class oE {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class hl {
        constructor(t, n) {
          (this.component = t), (this.route = n);
        }
      }
      function $F(e, t, n) {
        const r = e._root;
        return Yo(r, t ? t._root : null, n, [r.value]);
      }
      function Ti(e, t) {
        const n = Symbol(),
          r = t.get(e, n);
        return r === n
          ? "function" != typeof e ||
            (function B0(e) {
              return null !== gs(e);
            })(e)
            ? t.get(e)
            : e
          : r;
      }
      function Yo(e, t, n, r, i = { canDeactivateChecks: [], canActivateChecks: [] }) {
        const o = Si(t);
        return (
          e.children.forEach(s => {
            (function zF(e, t, n, r, i = { canDeactivateChecks: [], canActivateChecks: [] }) {
              const o = e.value,
                s = t ? t.value : null,
                a = n ? n.getContext(e.value.outlet) : null;
              if (s && o.routeConfig === s.routeConfig) {
                const l = (function qF(e, t, n) {
                  if ("function" == typeof n) return n(e, t);
                  switch (n) {
                    case "pathParamsChange":
                      return !br(e.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return !br(e.url, t.url) || !hn(e.queryParams, t.queryParams);
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !kf(e, t) || !hn(e.queryParams, t.queryParams);
                    default:
                      return !kf(e, t);
                  }
                })(s, o, o.routeConfig.runGuardsAndResolvers);
                l ? i.canActivateChecks.push(new oE(r)) : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
                  Yo(e, t, o.component ? (a ? a.children : null) : n, r, i),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    i.canDeactivateChecks.push(new hl(a.outlet.component, s));
              } else
                s && Xo(t, a, i),
                  i.canActivateChecks.push(new oE(r)),
                  Yo(e, null, o.component ? (a ? a.children : null) : n, r, i);
            })(s, o[s.value.outlet], n, r.concat([s.value]), i),
              delete o[s.value.outlet];
          }),
          Object.entries(o).forEach(([s, a]) => Xo(a, n.getContext(s), i)),
          i
        );
      }
      function Xo(e, t, n) {
        const r = Si(e),
          i = e.value;
        Object.entries(r).forEach(([o, s]) => {
          Xo(s, i.component ? (t ? t.children.getContext(o) : null) : t, n);
        }),
          n.canDeactivateChecks.push(
            new hl(i.component && t && t.outlet && t.outlet.isActivated ? t.outlet.component : null, i)
          );
      }
      function Jo(e) {
        return "function" == typeof e;
      }
      function sE(e) {
        return e instanceof nl || "EmptyError" === e?.name;
      }
      const pl = Symbol("INITIAL_VALUE");
      function Ii() {
        return fn(e =>
          _f(
            e.map(t =>
              t.pipe(
                wi(1),
                (function LO(...e) {
                  const t = Li(e);
                  return Le((n, r) => {
                    (t ? wf(e, n, t) : wf(e, n)).subscribe(r);
                  });
                })(pl)
              )
            )
          ).pipe(
            te(t => {
              for (const n of t)
                if (!0 !== n) {
                  if (n === pl) return pl;
                  if (!1 === n || n instanceof bi) return n;
                }
              return !0;
            }),
            xn(t => t !== pl),
            wi(1)
          )
        );
      }
      function aE(e) {
        return (function UC(...e) {
          return Th(e);
        })(
          $e(t => {
            if (Sr(t)) throw eE(0, t);
          }),
          te(t => !0 === t)
        );
      }
      class gl {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class lE {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function Ai(e) {
        return Bo(new gl(e));
      }
      function uE(e) {
        return Bo(new lE(e));
      }
      class dk {
        constructor(t, n) {
          (this.urlSerializer = t), (this.urlTree = n);
        }
        noMatchError(t) {
          return new D(4002, !1);
        }
        lineralizeSegments(t, n) {
          let r = [],
            i = n.root;
          for (;;) {
            if (((r = r.concat(i.segments)), 0 === i.numberOfChildren)) return H(r);
            if (i.numberOfChildren > 1 || !i.children[W]) return Bo(new D(4e3, !1));
            i = i.children[W];
          }
        }
        applyRedirectCommands(t, n, r) {
          return this.applyRedirectCreateUrlTree(n, this.urlSerializer.parse(n), t, r);
        }
        applyRedirectCreateUrlTree(t, n, r, i) {
          const o = this.createSegmentGroup(t, n.root, r, i);
          return new bi(o, this.createQueryParams(n.queryParams, this.urlTree.queryParams), n.fragment);
        }
        createQueryParams(t, n) {
          const r = {};
          return (
            Object.entries(t).forEach(([i, o]) => {
              if ("string" == typeof o && o.startsWith(":")) {
                const a = o.substring(1);
                r[i] = n[a];
              } else r[i] = o;
            }),
            r
          );
        }
        createSegmentGroup(t, n, r, i) {
          const o = this.createSegments(t, n.segments, r, i);
          let s = {};
          return (
            Object.entries(n.children).forEach(([a, l]) => {
              s[a] = this.createSegmentGroup(t, l, r, i);
            }),
            new oe(o, s)
          );
        }
        createSegments(t, n, r, i) {
          return n.map(o => (o.path.startsWith(":") ? this.findPosParam(t, o, i) : this.findOrReturn(o, r)));
        }
        findPosParam(t, n, r) {
          const i = r[n.path.substring(1)];
          if (!i) throw new D(4001, !1);
          return i;
        }
        findOrReturn(t, n) {
          let r = 0;
          for (const i of n) {
            if (i.path === t.path) return n.splice(r), i;
            r++;
          }
          return t;
        }
      }
      const Bf = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function fk(e, t, n, r, i) {
        const o = Vf(e, t, n);
        return o.matched
          ? ((r = (function FF(e, t) {
              return (
                e.providers && !e._injector && (e._injector = od(e.providers, t, `Route: ${e.path}`)), e._injector ?? t
              );
            })(t, r)),
            (function lk(e, t, n, r) {
              const i = t.canMatch;
              return i && 0 !== i.length
                ? H(
                    i.map(s => {
                      const a = Ti(s, e);
                      return Yn(
                        (function YF(e) {
                          return e && Jo(e.canMatch);
                        })(a)
                          ? a.canMatch(t, n)
                          : e.runInContext(() => a(t, n))
                      );
                    })
                  ).pipe(Ii(), aE())
                : H(!0);
            })(r, t, n).pipe(te(s => (!0 === s ? o : { ...Bf }))))
          : H(o);
      }
      function Vf(e, t, n) {
        if ("" === t.path)
          return "full" === t.pathMatch && (e.hasChildren() || n.length > 0)
            ? { ...Bf }
            : { matched: !0, consumedSegments: [], remainingSegments: n, parameters: {}, positionalParamSegments: {} };
        const i = (t.matcher || zO)(n, e, t);
        if (!i) return { ...Bf };
        const o = {};
        Object.entries(i.posParams ?? {}).forEach(([a, l]) => {
          o[a] = l.path;
        });
        const s = i.consumed.length > 0 ? { ...o, ...i.consumed[i.consumed.length - 1].parameters } : o;
        return {
          matched: !0,
          consumedSegments: i.consumed,
          remainingSegments: n.slice(i.consumed.length),
          parameters: s,
          positionalParamSegments: i.posParams ?? {},
        };
      }
      function cE(e, t, n, r) {
        return n.length > 0 &&
          (function gk(e, t, n) {
            return n.some(r => ml(e, t, r) && Kt(r) !== W);
          })(e, n, r)
          ? { segmentGroup: new oe(t, pk(r, new oe(n, e.children))), slicedSegments: [] }
          : 0 === n.length &&
            (function mk(e, t, n) {
              return n.some(r => ml(e, t, r));
            })(e, n, r)
          ? { segmentGroup: new oe(e.segments, hk(e, 0, n, r, e.children)), slicedSegments: n }
          : { segmentGroup: new oe(e.segments, e.children), slicedSegments: n };
      }
      function hk(e, t, n, r, i) {
        const o = {};
        for (const s of r)
          if (ml(e, n, s) && !i[Kt(s)]) {
            const a = new oe([], {});
            o[Kt(s)] = a;
          }
        return { ...i, ...o };
      }
      function pk(e, t) {
        const n = {};
        n[W] = t;
        for (const r of e)
          if ("" === r.path && Kt(r) !== W) {
            const i = new oe([], {});
            n[Kt(r)] = i;
          }
        return n;
      }
      function ml(e, t, n) {
        return (!(e.hasChildren() || t.length > 0) || "full" !== n.pathMatch) && "" === n.path;
      }
      class _k {
        constructor(t, n, r, i, o, s, a) {
          (this.injector = t),
            (this.configLoader = n),
            (this.rootComponentType = r),
            (this.config = i),
            (this.urlTree = o),
            (this.paramsInheritanceStrategy = s),
            (this.urlSerializer = a),
            (this.allowRedirects = !0),
            (this.applyRedirects = new dk(this.urlSerializer, this.urlTree));
        }
        noMatchError(t) {
          return new D(4002, !1);
        }
        recognize() {
          const t = cE(this.urlTree.root, [], [], this.config).segmentGroup;
          return this.processSegmentGroup(this.injector, this.config, t, W).pipe(
            Cr(n => {
              if (n instanceof lE) return (this.allowRedirects = !1), (this.urlTree = n.urlTree), this.match(n.urlTree);
              throw n instanceof gl ? this.noMatchError(n) : n;
            }),
            te(n => {
              const r = new dl(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  W,
                  this.rootComponentType,
                  null,
                  {}
                ),
                i = new On(r, n),
                o = new Zw("", i),
                s = (function cF(e, t, n = null, r = null) {
                  return Bw(jw(e), t, n, r);
                })(r, [], this.urlTree.queryParams, this.urlTree.fragment);
              return (
                (s.queryParams = this.urlTree.queryParams),
                (o.url = this.urlSerializer.serialize(s)),
                this.inheritParamsAndData(o._root),
                { state: o, tree: s }
              );
            })
          );
        }
        match(t) {
          return this.processSegmentGroup(this.injector, this.config, t.root, W).pipe(
            Cr(r => {
              throw r instanceof gl ? this.noMatchError(r) : r;
            })
          );
        }
        inheritParamsAndData(t) {
          const n = t.value,
            r = Qw(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            t.children.forEach(i => this.inheritParamsAndData(i));
        }
        processSegmentGroup(t, n, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(t, n, r)
            : this.processSegment(t, n, r, r.segments, i, !0);
        }
        processChildren(t, n, r) {
          const i = [];
          for (const o of Object.keys(r.children)) "primary" === o ? i.unshift(o) : i.push(o);
          return Oe(i).pipe(
            Ei(o => {
              const s = r.children[o],
                a = (function BF(e, t) {
                  const n = e.filter(r => Kt(r) === t);
                  return n.push(...e.filter(r => Kt(r) !== t)), n;
                })(n, o);
              return this.processSegmentGroup(t, a, s, o);
            }),
            (function VO(e, t) {
              return Le(
                (function BO(e, t, n, r, i) {
                  return (o, s) => {
                    let a = n,
                      l = t,
                      u = 0;
                    o.subscribe(
                      je(
                        s,
                        c => {
                          const d = u++;
                          (l = a ? e(l, c, d) : ((a = !0), c)), r && s.next(l);
                        },
                        i &&
                          (() => {
                            a && s.next(l), s.complete();
                          })
                      )
                    );
                  };
                })(e, t, arguments.length >= 2, !0)
              );
            })((o, s) => (o.push(...s), o)),
            rl(null),
            (function HO(e, t) {
              const n = arguments.length >= 2;
              return r => r.pipe(e ? xn((i, o) => e(i, o, r)) : ir, Cf(1), n ? rl(t) : Sw(() => new nl()));
            })(),
            Be(o => {
              if (null === o) return Ai(r);
              const s = dE(o);
              return (
                (function wk(e) {
                  e.sort((t, n) =>
                    t.value.outlet === W ? -1 : n.value.outlet === W ? 1 : t.value.outlet.localeCompare(n.value.outlet)
                  );
                })(s),
                H(s)
              );
            })
          );
        }
        processSegment(t, n, r, i, o, s) {
          return Oe(n).pipe(
            Ei(a =>
              this.processSegmentAgainstRoute(a._injector ?? t, n, a, r, i, o, s).pipe(
                Cr(l => {
                  if (l instanceof gl) return H(null);
                  throw l;
                })
              )
            ),
            Er(a => !!a),
            Cr(a => {
              if (sE(a))
                return (function vk(e, t, n) {
                  return 0 === t.length && !e.children[n];
                })(r, i, o)
                  ? H([])
                  : Ai(r);
              throw a;
            })
          );
        }
        processSegmentAgainstRoute(t, n, r, i, o, s, a) {
          return (function yk(e, t, n, r) {
            return !!(Kt(e) === r || (r !== W && ml(t, n, e))) && ("**" === e.path || Vf(t, e, n).matched);
          })(r, i, o, s)
            ? void 0 === r.redirectTo
              ? this.matchSegmentAgainstRoute(t, i, r, o, s, a)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(t, i, n, r, o, s)
              : Ai(i)
            : Ai(i);
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, i, o, s) {
          return "**" === i.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, i, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, i, o, s);
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, i) {
          const o = this.applyRedirects.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/")
            ? uE(o)
            : this.applyRedirects.lineralizeSegments(r, o).pipe(
                Be(s => {
                  const a = new oe(s, {});
                  return this.processSegment(t, n, a, s, i, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, i, o, s) {
          const { matched: a, consumedSegments: l, remainingSegments: u, positionalParamSegments: c } = Vf(n, i, o);
          if (!a) return Ai(n);
          const d = this.applyRedirects.applyRedirectCommands(l, i.redirectTo, c);
          return i.redirectTo.startsWith("/")
            ? uE(d)
            : this.applyRedirects
                .lineralizeSegments(i, d)
                .pipe(Be(f => this.processSegment(t, r, n, f.concat(u), s, !1)));
        }
        matchSegmentAgainstRoute(t, n, r, i, o, s) {
          let a;
          if ("**" === r.path) {
            const l = i.length > 0 ? Tw(i).parameters : {};
            (a = H({
              snapshot: new dl(
                i,
                l,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                fE(r),
                Kt(r),
                r.component ?? r._loadedComponent ?? null,
                r,
                hE(r)
              ),
              consumedSegments: [],
              remainingSegments: [],
            })),
              (n.children = {});
          } else
            a = fk(n, r, i, t).pipe(
              te(({ matched: l, consumedSegments: u, remainingSegments: c, parameters: d }) =>
                l
                  ? {
                      snapshot: new dl(
                        u,
                        d,
                        Object.freeze({ ...this.urlTree.queryParams }),
                        this.urlTree.fragment,
                        fE(r),
                        Kt(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        hE(r)
                      ),
                      consumedSegments: u,
                      remainingSegments: c,
                    }
                  : null
              )
            );
          return a.pipe(
            fn(l =>
              null === l
                ? Ai(n)
                : this.getChildConfig((t = r._injector ?? t), r, i).pipe(
                    fn(({ routes: u }) => {
                      const c = r._loadedInjector ?? t,
                        { snapshot: d, consumedSegments: f, remainingSegments: h } = l,
                        { segmentGroup: p, slicedSegments: g } = cE(n, f, h, u);
                      if (0 === g.length && p.hasChildren())
                        return this.processChildren(c, u, p).pipe(te(v => (null === v ? null : [new On(d, v)])));
                      if (0 === u.length && 0 === g.length) return H([new On(d, [])]);
                      const y = Kt(r) === o;
                      return this.processSegment(c, u, p, g, y ? W : o, !0).pipe(te(v => [new On(d, v)]));
                    })
                  )
            )
          );
        }
        getChildConfig(t, n, r) {
          return n.children
            ? H({ routes: n.children, injector: t })
            : n.loadChildren
            ? void 0 !== n._loadedRoutes
              ? H({ routes: n._loadedRoutes, injector: n._loadedInjector })
              : (function ak(e, t, n, r) {
                  const i = t.canLoad;
                  return void 0 === i || 0 === i.length
                    ? H(!0)
                    : H(
                        i.map(s => {
                          const a = Ti(s, e);
                          return Yn(
                            (function WF(e) {
                              return e && Jo(e.canLoad);
                            })(a)
                              ? a.canLoad(t, n)
                              : e.runInContext(() => a(t, n))
                          );
                        })
                      ).pipe(Ii(), aE());
                })(t, n, r).pipe(
                  Be(i =>
                    i
                      ? this.configLoader.loadChildren(t, n).pipe(
                          $e(o => {
                            (n._loadedRoutes = o.routes), (n._loadedInjector = o.injector);
                          })
                        )
                      : (function ck(e) {
                          return Bo(tE(!1, 3));
                        })()
                  )
                )
            : H({ routes: [], injector: t });
        }
      }
      function Ek(e) {
        const t = e.value.routeConfig;
        return t && "" === t.path;
      }
      function dE(e) {
        const t = [],
          n = new Set();
        for (const r of e) {
          if (!Ek(r)) {
            t.push(r);
            continue;
          }
          const i = t.find(o => r.value.routeConfig === o.value.routeConfig);
          void 0 !== i ? (i.children.push(...r.children), n.add(i)) : t.push(r);
        }
        for (const r of n) {
          const i = dE(r.children);
          t.push(new On(r.value, i));
        }
        return t.filter(r => !n.has(r));
      }
      function fE(e) {
        return e.data || {};
      }
      function hE(e) {
        return e.resolve || {};
      }
      function pE(e) {
        return "string" == typeof e.title || null === e.title;
      }
      function Hf(e) {
        return fn(t => {
          const n = e(t);
          return n ? Oe(n).pipe(te(() => t)) : H(t);
        });
      }
      const Ni = new A("ROUTES");
      let $f = (() => {
        class e {
          constructor() {
            (this.componentLoaders = new WeakMap()), (this.childrenLoaders = new WeakMap()), (this.compiler = I($D));
          }
          loadComponent(n) {
            if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
            if (n._loadedComponent) return H(n._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(n);
            const r = Yn(n.loadComponent()).pipe(
                te(gE),
                $e(o => {
                  this.onLoadEndListener && this.onLoadEndListener(n), (n._loadedComponent = o);
                }),
                bf(() => {
                  this.componentLoaders.delete(n);
                })
              ),
              i = new bw(r, () => new yn()).pipe(Ef());
            return this.componentLoaders.set(n, i), i;
          }
          loadChildren(n, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes) return H({ routes: r._loadedRoutes, injector: r._loadedInjector });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const o = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                te(a => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let l, u;
                  return (
                    Array.isArray(a)
                      ? (u = a)
                      : ((l = a.create(n).injector), (u = l.get(Ni, [], F.Self | F.Optional).flat())),
                    { routes: u.map(jf), injector: l }
                  );
                }),
                bf(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new bw(o, () => new yn()).pipe(Ef());
            return this.childrenLoaders.set(r, s), s;
          }
          loadModuleFactoryOrRoutes(n) {
            return Yn(n()).pipe(
              te(gE),
              Be(r => (r instanceof Wv || Array.isArray(r) ? H(r) : Oe(this.compiler.compileModuleAsync(r))))
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function gE(e) {
        return (function Ak(e) {
          return e && "object" == typeof e && "default" in e;
        })(e)
          ? e.default
          : e;
      }
      let yl = (() => {
        class e {
          get hasRequestedNavigation() {
            return 0 !== this.navigationId;
          }
          constructor() {
            (this.currentNavigation = null),
              (this.lastSuccessfulNavigation = null),
              (this.events = new yn()),
              (this.configLoader = I($f)),
              (this.environmentInjector = I(ln)),
              (this.urlSerializer = I($o)),
              (this.rootContexts = I(Ko)),
              (this.inputBindingEnabled = null !== I(fl, { optional: !0 })),
              (this.navigationId = 0),
              (this.afterPreactivation = () => H(void 0)),
              (this.rootComponentType = null),
              (this.configLoader.onLoadEndListener = i => this.events.next(new CF(i))),
              (this.configLoader.onLoadStartListener = i => this.events.next(new EF(i)));
          }
          complete() {
            this.transitions?.complete();
          }
          handleNavigationRequest(n) {
            const r = ++this.navigationId;
            this.transitions?.next({ ...this.transitions.value, ...n, id: r });
          }
          setupNavigations(n) {
            return (
              (this.transitions = new _t({
                id: 0,
                currentUrlTree: n.currentUrlTree,
                currentRawUrl: n.currentUrlTree,
                extractedUrl: n.urlHandlingStrategy.extract(n.currentUrlTree),
                urlAfterRedirects: n.urlHandlingStrategy.extract(n.currentUrlTree),
                rawUrl: n.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: Go,
                restoredState: null,
                currentSnapshot: n.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: n.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              this.transitions.pipe(
                xn(r => 0 !== r.id),
                te(r => ({ ...r, extractedUrl: n.urlHandlingStrategy.extract(r.rawUrl) })),
                fn(r => {
                  let i = !1,
                    o = !1;
                  return H(r).pipe(
                    $e(s => {
                      this.currentNavigation = {
                        id: s.id,
                        initialUrl: s.rawUrl,
                        extractedUrl: s.extractedUrl,
                        trigger: s.source,
                        extras: s.extras,
                        previousNavigation: this.lastSuccessfulNavigation
                          ? { ...this.lastSuccessfulNavigation, previousNavigation: null }
                          : null,
                      };
                    }),
                    fn(s => {
                      const a = n.browserUrlTree.toString(),
                        l = !n.navigated || s.extractedUrl.toString() !== a || a !== n.currentUrlTree.toString();
                      if (!l && "reload" !== (s.extras.onSameUrlNavigation ?? n.onSameUrlNavigation)) {
                        const c = "";
                        return (
                          this.events.next(new Wo(s.id, n.serializeUrl(r.rawUrl), c, 0)),
                          (n.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          Yt
                        );
                      }
                      if (n.urlHandlingStrategy.shouldProcessUrl(s.rawUrl))
                        return (
                          mE(s.source) && (n.browserUrlTree = s.extractedUrl),
                          H(s).pipe(
                            fn(c => {
                              const d = this.transitions?.getValue();
                              return (
                                this.events.next(
                                  new Nf(c.id, this.urlSerializer.serialize(c.extractedUrl), c.source, c.restoredState)
                                ),
                                d !== this.transitions?.getValue() ? Yt : Promise.resolve(c)
                              );
                            }),
                            (function Ck(e, t, n, r, i, o) {
                              return Be(s =>
                                (function Dk(e, t, n, r, i, o, s = "emptyOnly") {
                                  return new _k(e, t, n, r, i, s, o).recognize();
                                })(e, t, n, r, s.extractedUrl, i, o).pipe(
                                  te(({ state: a, tree: l }) => ({ ...s, targetSnapshot: a, urlAfterRedirects: l }))
                                )
                              );
                            })(
                              this.environmentInjector,
                              this.configLoader,
                              this.rootComponentType,
                              n.config,
                              this.urlSerializer,
                              n.paramsInheritanceStrategy
                            ),
                            $e(c => {
                              if (
                                ((r.targetSnapshot = c.targetSnapshot),
                                (r.urlAfterRedirects = c.urlAfterRedirects),
                                (this.currentNavigation = { ...this.currentNavigation, finalUrl: c.urlAfterRedirects }),
                                "eager" === n.urlUpdateStrategy)
                              ) {
                                if (!c.extras.skipLocationChange) {
                                  const f = n.urlHandlingStrategy.merge(c.urlAfterRedirects, c.rawUrl);
                                  n.setBrowserUrl(f, c);
                                }
                                n.browserUrlTree = c.urlAfterRedirects;
                              }
                              const d = new yF(
                                c.id,
                                this.urlSerializer.serialize(c.extractedUrl),
                                this.urlSerializer.serialize(c.urlAfterRedirects),
                                c.targetSnapshot
                              );
                              this.events.next(d);
                            })
                          )
                        );
                      if (l && n.urlHandlingStrategy.shouldProcessUrl(n.rawUrlTree)) {
                        const { id: c, extractedUrl: d, source: f, restoredState: h, extras: p } = s,
                          g = new Nf(c, this.urlSerializer.serialize(d), f, h);
                        this.events.next(g);
                        const y = Kw(0, this.rootComponentType).snapshot;
                        return H(
                          (r = {
                            ...s,
                            targetSnapshot: y,
                            urlAfterRedirects: d,
                            extras: { ...p, skipLocationChange: !1, replaceUrl: !1 },
                          })
                        );
                      }
                      {
                        const c = "";
                        return (
                          this.events.next(new Wo(s.id, n.serializeUrl(r.extractedUrl), c, 1)),
                          (n.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          Yt
                        );
                      }
                    }),
                    $e(s => {
                      const a = new vF(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot
                      );
                      this.events.next(a);
                    }),
                    te(s => (r = { ...s, guards: $F(s.targetSnapshot, s.currentSnapshot, this.rootContexts) })),
                    (function JF(e, t) {
                      return Be(n => {
                        const {
                          targetSnapshot: r,
                          currentSnapshot: i,
                          guards: { canActivateChecks: o, canDeactivateChecks: s },
                        } = n;
                        return 0 === s.length && 0 === o.length
                          ? H({ ...n, guardsResult: !0 })
                          : (function ek(e, t, n, r) {
                              return Oe(e).pipe(
                                Be(i =>
                                  (function sk(e, t, n, r, i) {
                                    const o = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
                                    return o && 0 !== o.length
                                      ? H(
                                          o.map(a => {
                                            const l = Zo(t) ?? i,
                                              u = Ti(a, l);
                                            return Yn(
                                              (function ZF(e) {
                                                return e && Jo(e.canDeactivate);
                                              })(u)
                                                ? u.canDeactivate(e, t, n, r)
                                                : l.runInContext(() => u(e, t, n, r))
                                            ).pipe(Er());
                                          })
                                        ).pipe(Ii())
                                      : H(!0);
                                  })(i.component, i.route, n, t, r)
                                ),
                                Er(i => !0 !== i, !0)
                              );
                            })(s, r, i, e).pipe(
                              Be(a =>
                                a &&
                                (function GF(e) {
                                  return "boolean" == typeof e;
                                })(a)
                                  ? (function tk(e, t, n, r) {
                                      return Oe(t).pipe(
                                        Ei(i =>
                                          wf(
                                            (function rk(e, t) {
                                              return null !== e && t && t(new bF(e)), H(!0);
                                            })(i.route.parent, r),
                                            (function nk(e, t) {
                                              return null !== e && t && t(new MF(e)), H(!0);
                                            })(i.route, r),
                                            (function ok(e, t, n) {
                                              const r = t[t.length - 1],
                                                o = t
                                                  .slice(0, t.length - 1)
                                                  .reverse()
                                                  .map(s =>
                                                    (function UF(e) {
                                                      const t = e.routeConfig ? e.routeConfig.canActivateChild : null;
                                                      return t && 0 !== t.length ? { node: e, guards: t } : null;
                                                    })(s)
                                                  )
                                                  .filter(s => null !== s)
                                                  .map(s =>
                                                    Cw(() =>
                                                      H(
                                                        s.guards.map(l => {
                                                          const u = Zo(s.node) ?? n,
                                                            c = Ti(l, u);
                                                          return Yn(
                                                            (function QF(e) {
                                                              return e && Jo(e.canActivateChild);
                                                            })(c)
                                                              ? c.canActivateChild(r, e)
                                                              : u.runInContext(() => c(r, e))
                                                          ).pipe(Er());
                                                        })
                                                      ).pipe(Ii())
                                                    )
                                                  );
                                              return H(o).pipe(Ii());
                                            })(e, i.path, n),
                                            (function ik(e, t, n) {
                                              const r = t.routeConfig ? t.routeConfig.canActivate : null;
                                              if (!r || 0 === r.length) return H(!0);
                                              const i = r.map(o =>
                                                Cw(() => {
                                                  const s = Zo(t) ?? n,
                                                    a = Ti(o, s);
                                                  return Yn(
                                                    (function KF(e) {
                                                      return e && Jo(e.canActivate);
                                                    })(a)
                                                      ? a.canActivate(t, e)
                                                      : s.runInContext(() => a(t, e))
                                                  ).pipe(Er());
                                                })
                                              );
                                              return H(i).pipe(Ii());
                                            })(e, i.route, n)
                                          )
                                        ),
                                        Er(i => !0 !== i, !0)
                                      );
                                    })(r, o, e, t)
                                  : H(a)
                              ),
                              te(a => ({ ...n, guardsResult: a }))
                            );
                      });
                    })(this.environmentInjector, s => this.events.next(s)),
                    $e(s => {
                      if (((r.guardsResult = s.guardsResult), Sr(s.guardsResult))) throw eE(0, s.guardsResult);
                      const a = new DF(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot,
                        !!s.guardsResult
                      );
                      this.events.next(a);
                    }),
                    xn(s => !!s.guardsResult || (n.restoreHistory(s), this.cancelNavigationTransition(s, "", 3), !1)),
                    Hf(s => {
                      if (s.guards.canActivateChecks.length)
                        return H(s).pipe(
                          $e(a => {
                            const l = new _F(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          }),
                          fn(a => {
                            let l = !1;
                            return H(a).pipe(
                              (function bk(e, t) {
                                return Be(n => {
                                  const {
                                    targetSnapshot: r,
                                    guards: { canActivateChecks: i },
                                  } = n;
                                  if (!i.length) return H(n);
                                  let o = 0;
                                  return Oe(i).pipe(
                                    Ei(s =>
                                      (function Sk(e, t, n, r) {
                                        const i = e.routeConfig,
                                          o = e._resolve;
                                        return (
                                          void 0 !== i?.title && !pE(i) && (o[Vo] = i.title),
                                          (function Mk(e, t, n, r) {
                                            const i = (function Tk(e) {
                                              return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
                                            })(e);
                                            if (0 === i.length) return H({});
                                            const o = {};
                                            return Oe(i).pipe(
                                              Be(s =>
                                                (function Ik(e, t, n, r) {
                                                  const i = Zo(t) ?? r,
                                                    o = Ti(e, i);
                                                  return Yn(
                                                    o.resolve ? o.resolve(t, n) : i.runInContext(() => o(t, n))
                                                  );
                                                })(e[s], t, n, r).pipe(
                                                  Er(),
                                                  $e(a => {
                                                    o[s] = a;
                                                  })
                                                )
                                              ),
                                              Cf(1),
                                              (function $O(e) {
                                                return te(() => e);
                                              })(o),
                                              Cr(s => (sE(s) ? Yt : Bo(s)))
                                            );
                                          })(o, e, t, r).pipe(
                                            te(
                                              s => (
                                                (e._resolvedData = s),
                                                (e.data = Qw(e, n).resolve),
                                                i && pE(i) && (e.data[Vo] = i.title),
                                                null
                                              )
                                            )
                                          )
                                        );
                                      })(s.route, r, e, t)
                                    ),
                                    $e(() => o++),
                                    Cf(1),
                                    Be(s => (o === i.length ? H(n) : Yt))
                                  );
                                });
                              })(n.paramsInheritanceStrategy, this.environmentInjector),
                              $e({
                                next: () => (l = !0),
                                complete: () => {
                                  l || (n.restoreHistory(a), this.cancelNavigationTransition(a, "", 2));
                                },
                              })
                            );
                          }),
                          $e(a => {
                            const l = new wF(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          })
                        );
                    }),
                    Hf(s => {
                      const a = l => {
                        const u = [];
                        l.routeConfig?.loadComponent &&
                          !l.routeConfig._loadedComponent &&
                          u.push(
                            this.configLoader.loadComponent(l.routeConfig).pipe(
                              $e(c => {
                                l.component = c;
                              }),
                              te(() => {})
                            )
                          );
                        for (const c of l.children) u.push(...a(c));
                        return u;
                      };
                      return _f(a(s.targetSnapshot.root)).pipe(rl(), wi(1));
                    }),
                    Hf(() => this.afterPreactivation()),
                    te(s => {
                      const a = (function PF(e, t, n) {
                        const r = Qo(e, t._root, n ? n._root : void 0);
                        return new Ww(r, t);
                      })(n.routeReuseStrategy, s.targetSnapshot, s.currentRouterState);
                      return (r = { ...s, targetRouterState: a });
                    }),
                    $e(s => {
                      (n.currentUrlTree = s.urlAfterRedirects),
                        (n.rawUrlTree = n.urlHandlingStrategy.merge(s.urlAfterRedirects, s.rawUrl)),
                        (n.routerState = s.targetRouterState),
                        "deferred" === n.urlUpdateStrategy &&
                          (s.extras.skipLocationChange || n.setBrowserUrl(n.rawUrlTree, s),
                          (n.browserUrlTree = s.urlAfterRedirects));
                    }),
                    ((e, t, n, r) =>
                      te(i => (new HF(t, i.targetRouterState, i.currentRouterState, n, r).activate(e), i)))(
                      this.rootContexts,
                      n.routeReuseStrategy,
                      s => this.events.next(s),
                      this.inputBindingEnabled
                    ),
                    wi(1),
                    $e({
                      next: s => {
                        (i = !0),
                          (this.lastSuccessfulNavigation = this.currentNavigation),
                          (n.navigated = !0),
                          this.events.next(
                            new Mr(
                              s.id,
                              this.urlSerializer.serialize(s.extractedUrl),
                              this.urlSerializer.serialize(n.currentUrlTree)
                            )
                          ),
                          n.titleStrategy?.updateTitle(s.targetRouterState.snapshot),
                          s.resolve(!0);
                      },
                      complete: () => {
                        i = !0;
                      },
                    }),
                    bf(() => {
                      i || o || this.cancelNavigationTransition(r, "", 1),
                        this.currentNavigation?.id === r.id && (this.currentNavigation = null);
                    }),
                    Cr(s => {
                      if (((o = !0), rE(s))) {
                        nE(s) || ((n.navigated = !0), n.restoreHistory(r, !0));
                        const a = new cl(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s.message,
                          s.cancellationCode
                        );
                        if ((this.events.next(a), nE(s))) {
                          const l = n.urlHandlingStrategy.merge(s.url, n.rawUrlTree),
                            u = {
                              skipLocationChange: r.extras.skipLocationChange,
                              replaceUrl: "eager" === n.urlUpdateStrategy || mE(r.source),
                            };
                          n.scheduleNavigation(l, Go, null, u, {
                            resolve: r.resolve,
                            reject: r.reject,
                            promise: r.promise,
                          });
                        } else r.resolve(!1);
                      } else {
                        n.restoreHistory(r, !0);
                        const a = new Rf(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s,
                          r.targetSnapshot ?? void 0
                        );
                        this.events.next(a);
                        try {
                          r.resolve(n.errorHandler(s));
                        } catch (l) {
                          r.reject(l);
                        }
                      }
                      return Yt;
                    })
                  );
                })
              )
            );
          }
          cancelNavigationTransition(n, r, i) {
            const o = new cl(n.id, this.urlSerializer.serialize(n.extractedUrl), r, i);
            this.events.next(o), n.resolve(!1);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function mE(e) {
        return e !== Go;
      }
      let yE = (() => {
          class e {
            buildTitle(n) {
              let r,
                i = n.root;
              for (; void 0 !== i; )
                (r = this.getResolvedTitleForRoute(i) ?? r), (i = i.children.find(o => o.outlet === W));
              return r;
            }
            getResolvedTitleForRoute(n) {
              return n.data[Vo];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({
              token: e,
              factory: function () {
                return I(Nk);
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        Nk = (() => {
          class e extends yE {
            constructor(n) {
              super(), (this.title = n);
            }
            updateTitle(n) {
              const r = this.buildTitle(n);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(vw));
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        Rk = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({
              token: e,
              factory: function () {
                return I(xk);
              },
              providedIn: "root",
            })),
            e
          );
        })();
      class Pk {
        shouldDetach(t) {
          return !1;
        }
        store(t, n) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, n) {
          return t.routeConfig === n.routeConfig;
        }
      }
      let xk = (() => {
        class e extends Pk {}
        return (
          (e.ɵfac = (function () {
            let t;
            return function (r) {
              return (
                t ||
                (t = (function ag(e) {
                  return Dn(() => {
                    const t = e.prototype.constructor,
                      n = t[wn] || Mu(t),
                      r = Object.prototype;
                    let i = Object.getPrototypeOf(e.prototype).constructor;
                    for (; i && i !== r; ) {
                      const o = i[wn] || Mu(i);
                      if (o && o !== n) return o;
                      i = Object.getPrototypeOf(i);
                    }
                    return o => new o();
                  });
                })(e))
              )(r || e);
            };
          })()),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const vl = new A("", { providedIn: "root", factory: () => ({}) });
      let Ok = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({
              token: e,
              factory: function () {
                return I(Fk);
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        Fk = (() => {
          class e {
            shouldProcessUrl(n) {
              return !0;
            }
            extract(n) {
              return n;
            }
            merge(n, r) {
              return n;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })();
      var wt = (() => (
        ((wt = wt || {})[(wt.COMPLETE = 0)] = "COMPLETE"),
        (wt[(wt.FAILED = 1)] = "FAILED"),
        (wt[(wt.REDIRECTING = 2)] = "REDIRECTING"),
        wt
      ))();
      function vE(e, t) {
        e.events
          .pipe(
            xn(n => n instanceof Mr || n instanceof cl || n instanceof Rf || n instanceof Wo),
            te(n =>
              n instanceof Mr || n instanceof Wo
                ? wt.COMPLETE
                : n instanceof cl && (0 === n.code || 1 === n.code)
                ? wt.REDIRECTING
                : wt.FAILED
            ),
            xn(n => n !== wt.REDIRECTING),
            wi(1)
          )
          .subscribe(() => {
            t();
          });
      }
      function kk(e) {
        throw e;
      }
      function Lk(e, t, n) {
        return t.parse("/");
      }
      const jk = { paths: "exact", fragment: "ignored", matrixParams: "ignored", queryParams: "exact" },
        Bk = { paths: "subset", fragment: "ignored", matrixParams: "ignored", queryParams: "subset" };
      let xt = (() => {
        class e {
          get navigationId() {
            return this.navigationTransitions.navigationId;
          }
          get browserPageId() {
            if ("computed" === this.canceledNavigationResolution) return this.location.getState()?.ɵrouterPageId;
          }
          get events() {
            return this.navigationTransitions.events;
          }
          constructor() {
            (this.disposed = !1),
              (this.currentPageId = 0),
              (this.console = I(HD)),
              (this.isNgZoneEnabled = !1),
              (this.options = I(vl, { optional: !0 }) || {}),
              (this.pendingTasks = I(b_)),
              (this.errorHandler = this.options.errorHandler || kk),
              (this.malformedUriErrorHandler = this.options.malformedUriErrorHandler || Lk),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.urlHandlingStrategy = I(Ok)),
              (this.routeReuseStrategy = I(Rk)),
              (this.titleStrategy = I(yE)),
              (this.onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore"),
              (this.paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || "emptyOnly"),
              (this.urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred"),
              (this.canceledNavigationResolution = this.options.canceledNavigationResolution || "replace"),
              (this.config = I(Ni, { optional: !0 })?.flat() ?? []),
              (this.navigationTransitions = I(yl)),
              (this.urlSerializer = I($o)),
              (this.location = I(qd)),
              (this.componentInputBindingEnabled = !!I(fl, { optional: !0 })),
              (this.isNgZoneEnabled = I(ue) instanceof ue && ue.isInAngularZone()),
              this.resetConfig(this.config),
              (this.currentUrlTree = new bi()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = Kw(0, null)),
              this.navigationTransitions.setupNavigations(this).subscribe(
                n => {
                  (this.lastSuccessfulId = n.id), (this.currentPageId = this.browserPageId ?? 0);
                },
                n => {
                  this.console.warn(`Unhandled Navigation Error: ${n}`);
                }
              );
          }
          resetRootComponentType(n) {
            (this.routerState.root.component = n), (this.navigationTransitions.rootComponentType = n);
          }
          initialNavigation() {
            if ((this.setUpLocationChangeListener(), !this.navigationTransitions.hasRequestedNavigation)) {
              const n = this.location.getState();
              this.navigateToSyncWithBrowser(this.location.path(!0), Go, n);
            }
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe(n => {
                const r = "popstate" === n.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    this.navigateToSyncWithBrowser(n.url, r, n.state);
                  }, 0);
              }));
          }
          navigateToSyncWithBrowser(n, r, i) {
            const o = { replaceUrl: !0 },
              s = i?.navigationId ? i : null;
            if (i) {
              const l = { ...i };
              delete l.navigationId, delete l.ɵrouterPageId, 0 !== Object.keys(l).length && (o.state = l);
            }
            const a = this.parseUrl(n);
            this.scheduleNavigation(a, r, s, o);
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.navigationTransitions.currentNavigation;
          }
          get lastSuccessfulNavigation() {
            return this.navigationTransitions.lastSuccessfulNavigation;
          }
          resetConfig(n) {
            (this.config = n.map(jf)), (this.navigated = !1), (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.navigationTransitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(), (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(n, r = {}) {
            const { relativeTo: i, queryParams: o, fragment: s, queryParamsHandling: a, preserveFragment: l } = r,
              u = l ? this.currentUrlTree.fragment : s;
            let d,
              c = null;
            switch (a) {
              case "merge":
                c = { ...this.currentUrlTree.queryParams, ...o };
                break;
              case "preserve":
                c = this.currentUrlTree.queryParams;
                break;
              default:
                c = o || null;
            }
            null !== c && (c = this.removeEmptyProps(c));
            try {
              d = jw(i ? i.snapshot : this.routerState.snapshot.root);
            } catch {
              ("string" != typeof n[0] || !n[0].startsWith("/")) && (n = []), (d = this.currentUrlTree.root);
            }
            return Bw(d, n, c, u ?? null);
          }
          navigateByUrl(n, r = { skipLocationChange: !1 }) {
            const i = Sr(n) ? n : this.parseUrl(n),
              o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
            return this.scheduleNavigation(o, Go, null, r);
          }
          navigate(n, r = { skipLocationChange: !1 }) {
            return (
              (function Vk(e) {
                for (let t = 0; t < e.length; t++) if (null == e[t]) throw new D(4008, !1);
              })(n),
              this.navigateByUrl(this.createUrlTree(n, r), r)
            );
          }
          serializeUrl(n) {
            return this.urlSerializer.serialize(n);
          }
          parseUrl(n) {
            let r;
            try {
              r = this.urlSerializer.parse(n);
            } catch (i) {
              r = this.malformedUriErrorHandler(i, this.urlSerializer, n);
            }
            return r;
          }
          isActive(n, r) {
            let i;
            if (((i = !0 === r ? { ...jk } : !1 === r ? { ...Bk } : r), Sr(n))) return Aw(this.currentUrlTree, n, i);
            const o = this.parseUrl(n);
            return Aw(this.currentUrlTree, o, i);
          }
          removeEmptyProps(n) {
            return Object.keys(n).reduce((r, i) => {
              const o = n[i];
              return null != o && (r[i] = o), r;
            }, {});
          }
          scheduleNavigation(n, r, i, o, s) {
            if (this.disposed) return Promise.resolve(!1);
            let a, l, u;
            s
              ? ((a = s.resolve), (l = s.reject), (u = s.promise))
              : (u = new Promise((d, f) => {
                  (a = d), (l = f);
                }));
            const c = this.pendingTasks.add();
            return (
              vE(this, () => {
                Promise.resolve().then(() => this.pendingTasks.remove(c));
              }),
              this.navigationTransitions.handleNavigationRequest({
                source: r,
                restoredState: i,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                rawUrl: n,
                extras: o,
                resolve: a,
                reject: l,
                promise: u,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              u.catch(d => Promise.reject(d))
            );
          }
          setBrowserUrl(n, r) {
            const i = this.urlSerializer.serialize(n);
            if (this.location.isCurrentPathEqualTo(i) || r.extras.replaceUrl) {
              const s = { ...r.extras.state, ...this.generateNgRouterState(r.id, this.browserPageId) };
              this.location.replaceState(i, "", s);
            } else {
              const o = { ...r.extras.state, ...this.generateNgRouterState(r.id, (this.browserPageId ?? 0) + 1) };
              this.location.go(i, "", o);
            }
          }
          restoreHistory(n, r = !1) {
            if ("computed" === this.canceledNavigationResolution) {
              const o = this.currentPageId - (this.browserPageId ?? this.currentPageId);
              0 !== o
                ? this.location.historyGo(o)
                : this.currentUrlTree === this.getCurrentNavigation()?.finalUrl &&
                  0 === o &&
                  (this.resetState(n), (this.browserUrlTree = n.currentUrlTree), this.resetUrlToCurrentUrlTree());
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
          }
          resetState(n) {
            (this.routerState = n.currentRouterState),
              (this.currentUrlTree = n.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, n.rawUrl));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
            );
          }
          generateNgRouterState(n, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: n, ɵrouterPageId: r }
              : { navigationId: n };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      class DE {}
      let Uk = (() => {
        class e {
          constructor(n, r, i, o, s) {
            (this.router = n), (this.injector = i), (this.preloadingStrategy = o), (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                xn(n => n instanceof Mr),
                Ei(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(n, r) {
            const i = [];
            for (const o of r) {
              o.providers && !o._injector && (o._injector = od(o.providers, n, `Route: ${o.path}`));
              const s = o._injector ?? n,
                a = o._loadedInjector ?? s;
              ((o.loadChildren && !o._loadedRoutes && void 0 === o.canLoad) ||
                (o.loadComponent && !o._loadedComponent)) &&
                i.push(this.preloadConfig(s, o)),
                (o.children || o._loadedRoutes) && i.push(this.processRoutes(a, o.children ?? o._loadedRoutes));
            }
            return Oe(i).pipe(Pr());
          }
          preloadConfig(n, r) {
            return this.preloadingStrategy.preload(r, () => {
              let i;
              i = r.loadChildren && void 0 === r.canLoad ? this.loader.loadChildren(n, r) : H(null);
              const o = i.pipe(
                Be(s =>
                  null === s
                    ? H(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? n, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent ? Oe([o, this.loader.loadComponent(r)]).pipe(Pr()) : o;
            });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(xt), M($D), M(ln), M(DE), M($f));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const zf = new A("");
      let _E = (() => {
        class e {
          constructor(n, r, i, o, s = {}) {
            (this.urlSerializer = n),
              (this.transitions = r),
              (this.viewportScroller = i),
              (this.zone = o),
              (this.options = s),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (s.scrollPositionRestoration = s.scrollPositionRestoration || "disabled"),
              (s.anchorScrolling = s.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.transitions.events.subscribe(n => {
              n instanceof Nf
                ? ((this.store[this.lastId] = this.viewportScroller.getScrollPosition()),
                  (this.lastSource = n.navigationTrigger),
                  (this.restoredId = n.restoredState ? n.restoredState.navigationId : 0))
                : n instanceof Mr
                ? ((this.lastId = n.id),
                  this.scheduleScrollEvent(n, this.urlSerializer.parse(n.urlAfterRedirects).fragment))
                : n instanceof Wo &&
                  0 === n.code &&
                  ((this.lastSource = void 0),
                  (this.restoredId = 0),
                  this.scheduleScrollEvent(n, this.urlSerializer.parse(n.url).fragment));
            });
          }
          consumeScrollEvents() {
            return this.transitions.events.subscribe(n => {
              n instanceof qw &&
                (n.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(n.position)
                  : n.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(n.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(n, r) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.transitions.events.next(
                    new qw(n, "popstate" === this.lastSource ? this.store[this.restoredId] : null, r)
                  );
                });
              }, 0);
            });
          }
          ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(), this.scrollEventsSubscription?.unsubscribe();
          }
        }
        return (
          (e.ɵfac = function (n) {
            !(function Bm() {
              throw new Error("invalid");
            })();
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function Fn(e, t) {
        return { ɵkind: e, ɵproviders: t };
      }
      function EE() {
        const e = I(Tn);
        return t => {
          const n = e.get(Dr);
          if (t !== n.components[0]) return;
          const r = e.get(xt),
            i = e.get(CE);
          1 === e.get(qf) && r.initialNavigation(),
            e.get(bE, null, F.Optional)?.setUpPreloading(),
            e.get(zf, null, F.Optional)?.init(),
            r.resetRootComponentType(n.componentTypes[0]),
            i.closed || (i.next(), i.complete(), i.unsubscribe());
        };
      }
      const CE = new A("", { factory: () => new yn() }),
        qf = new A("", { providedIn: "root", factory: () => 1 }),
        bE = new A("");
      function Wk(e) {
        return Fn(0, [
          { provide: bE, useExisting: Uk },
          { provide: DE, useExisting: e },
        ]);
      }
      const SE = new A("ROUTER_FORROOT_GUARD"),
        Qk = [
          qd,
          { provide: $o, useClass: Sf },
          xt,
          Ko,
          {
            provide: Mi,
            useFactory: function wE(e) {
              return e.routerState.root;
            },
            deps: [xt],
          },
          $f,
          [],
        ];
      function Zk() {
        return new JD("Router", xt);
      }
      let ME = (() => {
        class e {
          constructor(n) {}
          static forRoot(n, r) {
            return {
              ngModule: e,
              providers: [
                Qk,
                [],
                { provide: Ni, multi: !0, useValue: n },
                { provide: SE, useFactory: eL, deps: [[xt, new $s(), new Us()]] },
                { provide: vl, useValue: r || {} },
                r?.useHash ? { provide: wr, useClass: oP } : { provide: wr, useClass: I_ },
                {
                  provide: zf,
                  useFactory: () => {
                    const e = I(wx),
                      t = I(ue),
                      n = I(vl),
                      r = I(yl),
                      i = I($o);
                    return n.scrollOffset && e.setOffset(n.scrollOffset), new _E(i, r, e, t, n);
                  },
                },
                r?.preloadingStrategy ? Wk(r.preloadingStrategy).ɵproviders : [],
                { provide: JD, multi: !0, useFactory: Zk },
                r?.initialNavigation ? tL(r) : [],
                r?.bindToComponentInputs ? Fn(8, [Jw, { provide: fl, useExisting: Jw }]).ɵproviders : [],
                [
                  { provide: TE, useFactory: EE },
                  { provide: Pd, multi: !0, useExisting: TE },
                ],
              ],
            };
          }
          static forChild(n) {
            return { ngModule: e, providers: [{ provide: Ni, multi: !0, useValue: n }] };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(SE, 8));
          }),
          (e.ɵmod = en({ type: e })),
          (e.ɵinj = jt({})),
          e
        );
      })();
      function eL(e) {
        return "guarded";
      }
      function tL(e) {
        return [
          "disabled" === e.initialNavigation
            ? Fn(3, [
                {
                  provide: Cd,
                  multi: !0,
                  useFactory: () => {
                    const t = I(xt);
                    return () => {
                      t.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: qf, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === e.initialNavigation
            ? Fn(2, [
                { provide: qf, useValue: 0 },
                {
                  provide: Cd,
                  multi: !0,
                  deps: [Tn],
                  useFactory: t => {
                    const n = t.get(rP, Promise.resolve());
                    return () =>
                      n.then(
                        () =>
                          new Promise(r => {
                            const i = t.get(xt),
                              o = t.get(CE);
                            vE(i, () => {
                              r(!0);
                            }),
                              (t.get(yl).afterPreactivation = () => (r(!0), o.closed ? H(void 0) : o)),
                              i.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const TE = new A(""),
        rL = [];
      let iL = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = en({ type: e })),
            (e.ɵinj = jt({ imports: [ME.forRoot(rL), ME] })),
            e
          );
        })(),
        IE = (() => {
          class e {
            constructor() {
              (this.posts = new _t(null)),
                (this.posts$ = this.posts.asObservable()),
                (this.portfolios = new _t(null)),
                (this.portfolios$ = this.portfolios.asObservable());
            }
            loadPosts(n) {
              this.posts.next(n);
            }
            loadPortfolios(n) {
              this.portfolios.next(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      class Dl {}
      class Gf {}
      class Qt {
        constructor(t) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            t
              ? (this.lazyInit =
                  "string" == typeof t
                    ? () => {
                        (this.headers = new Map()),
                          t.split("\n").forEach(n => {
                            const r = n.indexOf(":");
                            if (r > 0) {
                              const i = n.slice(0, r),
                                o = i.toLowerCase(),
                                s = n.slice(r + 1).trim();
                              this.maybeSetNormalizedName(i, o),
                                this.headers.has(o) ? this.headers.get(o).push(s) : this.headers.set(o, [s]);
                            }
                          });
                      }
                    : () => {
                        (this.headers = new Map()),
                          Object.entries(t).forEach(([n, r]) => {
                            let i;
                            if (
                              ((i =
                                "string" == typeof r
                                  ? [r]
                                  : "number" == typeof r
                                  ? [r.toString()]
                                  : r.map(o => o.toString())),
                              i.length > 0)
                            ) {
                              const o = n.toLowerCase();
                              this.headers.set(o, i), this.maybeSetNormalizedName(n, o);
                            }
                          });
                      })
              : (this.headers = new Map());
        }
        has(t) {
          return this.init(), this.headers.has(t.toLowerCase());
        }
        get(t) {
          this.init();
          const n = this.headers.get(t.toLowerCase());
          return n && n.length > 0 ? n[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(t) {
          return this.init(), this.headers.get(t.toLowerCase()) || null;
        }
        append(t, n) {
          return this.clone({ name: t, value: n, op: "a" });
        }
        set(t, n) {
          return this.clone({ name: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ name: t, value: n, op: "d" });
        }
        maybeSetNormalizedName(t, n) {
          this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof Qt ? this.copyFrom(this.lazyInit) : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate && (this.lazyUpdate.forEach(t => this.applyUpdate(t)), (this.lazyUpdate = null)));
        }
        copyFrom(t) {
          t.init(),
            Array.from(t.headers.keys()).forEach(n => {
              this.headers.set(n, t.headers.get(n)), this.normalizedNames.set(n, t.normalizedNames.get(n));
            });
        }
        clone(t) {
          const n = new Qt();
          return (
            (n.lazyInit = this.lazyInit && this.lazyInit instanceof Qt ? this.lazyInit : this),
            (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
            n
          );
        }
        applyUpdate(t) {
          const n = t.name.toLowerCase();
          switch (t.op) {
            case "a":
            case "s":
              let r = t.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(t.name, n);
              const i = ("a" === t.op ? this.headers.get(n) : void 0) || [];
              i.push(...r), this.headers.set(n, i);
              break;
            case "d":
              const o = t.value;
              if (o) {
                let s = this.headers.get(n);
                if (!s) return;
                (s = s.filter(a => -1 === o.indexOf(a))),
                  0 === s.length ? (this.headers.delete(n), this.normalizedNames.delete(n)) : this.headers.set(n, s);
              } else this.headers.delete(n), this.normalizedNames.delete(n);
          }
        }
        forEach(t) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach(n => t(this.normalizedNames.get(n), this.headers.get(n)));
        }
      }
      class oL {
        encodeKey(t) {
          return AE(t);
        }
        encodeValue(t) {
          return AE(t);
        }
        decodeKey(t) {
          return decodeURIComponent(t);
        }
        decodeValue(t) {
          return decodeURIComponent(t);
        }
      }
      const aL = /%(\d[a-f0-9])/gi,
        lL = { 40: "@", "3A": ":", 24: "$", "2C": ",", "3B": ";", "3D": "=", "3F": "?", "2F": "/" };
      function AE(e) {
        return encodeURIComponent(e).replace(aL, (t, n) => lL[n] ?? t);
      }
      function _l(e) {
        return `${e}`;
      }
      class Xn {
        constructor(t = {}) {
          if (((this.updates = null), (this.cloneFrom = null), (this.encoder = t.encoder || new oL()), t.fromString)) {
            if (t.fromObject) throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function sL(e, t) {
              const n = new Map();
              return (
                e.length > 0 &&
                  e
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach(i => {
                      const o = i.indexOf("="),
                        [s, a] =
                          -1 == o ? [t.decodeKey(i), ""] : [t.decodeKey(i.slice(0, o)), t.decodeValue(i.slice(o + 1))],
                        l = n.get(s) || [];
                      l.push(a), n.set(s, l);
                    }),
                n
              );
            })(t.fromString, this.encoder);
          } else
            t.fromObject
              ? ((this.map = new Map()),
                Object.keys(t.fromObject).forEach(n => {
                  const r = t.fromObject[n],
                    i = Array.isArray(r) ? r.map(_l) : [_l(r)];
                  this.map.set(n, i);
                }))
              : (this.map = null);
        }
        has(t) {
          return this.init(), this.map.has(t);
        }
        get(t) {
          this.init();
          const n = this.map.get(t);
          return n ? n[0] : null;
        }
        getAll(t) {
          return this.init(), this.map.get(t) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(t, n) {
          return this.clone({ param: t, value: n, op: "a" });
        }
        appendAll(t) {
          const n = [];
          return (
            Object.keys(t).forEach(r => {
              const i = t[r];
              Array.isArray(i)
                ? i.forEach(o => {
                    n.push({ param: r, value: o, op: "a" });
                  })
                : n.push({ param: r, value: i, op: "a" });
            }),
            this.clone(n)
          );
        }
        set(t, n) {
          return this.clone({ param: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ param: t, value: n, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map(t => {
                const n = this.encoder.encodeKey(t);
                return this.map
                  .get(t)
                  .map(r => n + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter(t => "" !== t)
              .join("&")
          );
        }
        clone(t) {
          const n = new Xn({ encoder: this.encoder });
          return (n.cloneFrom = this.cloneFrom || this), (n.updates = (this.updates || []).concat(t)), n;
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom.keys().forEach(t => this.map.set(t, this.cloneFrom.map.get(t))),
              this.updates.forEach(t => {
                switch (t.op) {
                  case "a":
                  case "s":
                    const n = ("a" === t.op ? this.map.get(t.param) : void 0) || [];
                    n.push(_l(t.value)), this.map.set(t.param, n);
                    break;
                  case "d":
                    if (void 0 === t.value) {
                      this.map.delete(t.param);
                      break;
                    }
                    {
                      let r = this.map.get(t.param) || [];
                      const i = r.indexOf(_l(t.value));
                      -1 !== i && r.splice(i, 1), r.length > 0 ? this.map.set(t.param, r) : this.map.delete(t.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class uL {
        constructor() {
          this.map = new Map();
        }
        set(t, n) {
          return this.map.set(t, n), this;
        }
        get(t) {
          return this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t);
        }
        delete(t) {
          return this.map.delete(t), this;
        }
        has(t) {
          return this.map.has(t);
        }
        keys() {
          return this.map.keys();
        }
      }
      function NE(e) {
        return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
      }
      function RE(e) {
        return typeof Blob < "u" && e instanceof Blob;
      }
      function PE(e) {
        return typeof FormData < "u" && e instanceof FormData;
      }
      class es {
        constructor(t, n, r, i) {
          let o;
          if (
            ((this.url = n),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = t.toUpperCase()),
            (function cL(e) {
              switch (e) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || i
              ? ((this.body = void 0 !== r ? r : null), (o = i))
              : (o = r),
            o &&
              ((this.reportProgress = !!o.reportProgress),
              (this.withCredentials = !!o.withCredentials),
              o.responseType && (this.responseType = o.responseType),
              o.headers && (this.headers = o.headers),
              o.context && (this.context = o.context),
              o.params && (this.params = o.params)),
            this.headers || (this.headers = new Qt()),
            this.context || (this.context = new uL()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = n;
            else {
              const a = n.indexOf("?");
              this.urlWithParams = n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new Xn()), (this.urlWithParams = n);
        }
        serializeBody() {
          return null === this.body
            ? null
            : NE(this.body) ||
              RE(this.body) ||
              PE(this.body) ||
              (function dL(e) {
                return typeof URLSearchParams < "u" && e instanceof URLSearchParams;
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof Xn
            ? this.body.toString()
            : "object" == typeof this.body || "boolean" == typeof this.body || Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || PE(this.body)
            ? null
            : RE(this.body)
            ? this.body.type || null
            : NE(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof Xn
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body || "number" == typeof this.body || "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(t = {}) {
          const n = t.method || this.method,
            r = t.url || this.url,
            i = t.responseType || this.responseType,
            o = void 0 !== t.body ? t.body : this.body,
            s = void 0 !== t.withCredentials ? t.withCredentials : this.withCredentials,
            a = void 0 !== t.reportProgress ? t.reportProgress : this.reportProgress;
          let l = t.headers || this.headers,
            u = t.params || this.params;
          const c = t.context ?? this.context;
          return (
            void 0 !== t.setHeaders && (l = Object.keys(t.setHeaders).reduce((d, f) => d.set(f, t.setHeaders[f]), l)),
            t.setParams && (u = Object.keys(t.setParams).reduce((d, f) => d.set(f, t.setParams[f]), u)),
            new es(n, r, o, {
              params: u,
              headers: l,
              context: c,
              reportProgress: a,
              responseType: i,
              withCredentials: s,
            })
          );
        }
      }
      var Te = (() => (
        ((Te = Te || {})[(Te.Sent = 0)] = "Sent"),
        (Te[(Te.UploadProgress = 1)] = "UploadProgress"),
        (Te[(Te.ResponseHeader = 2)] = "ResponseHeader"),
        (Te[(Te.DownloadProgress = 3)] = "DownloadProgress"),
        (Te[(Te.Response = 4)] = "Response"),
        (Te[(Te.User = 5)] = "User"),
        Te
      ))();
      class Wf {
        constructor(t, n = 200, r = "OK") {
          (this.headers = t.headers || new Qt()),
            (this.status = void 0 !== t.status ? t.status : n),
            (this.statusText = t.statusText || r),
            (this.url = t.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class Kf extends Wf {
        constructor(t = {}) {
          super(t), (this.type = Te.ResponseHeader);
        }
        clone(t = {}) {
          return new Kf({
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class Ri extends Wf {
        constructor(t = {}) {
          super(t), (this.type = Te.Response), (this.body = void 0 !== t.body ? t.body : null);
        }
        clone(t = {}) {
          return new Ri({
            body: void 0 !== t.body ? t.body : this.body,
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class xE extends Wf {
        constructor(t) {
          super(t, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${t.url || "(unknown url)"}`
                : `Http failure response for ${t.url || "(unknown url)"}: ${t.status} ${t.statusText}`),
            (this.error = t.error || null);
        }
      }
      function Qf(e, t) {
        return {
          body: t,
          headers: e.headers,
          context: e.context,
          observe: e.observe,
          params: e.params,
          reportProgress: e.reportProgress,
          responseType: e.responseType,
          withCredentials: e.withCredentials,
        };
      }
      let OE = (() => {
        class e {
          constructor(n) {
            this.handler = n;
          }
          request(n, r, i = {}) {
            let o;
            if (n instanceof es) o = n;
            else {
              let l, u;
              (l = i.headers instanceof Qt ? i.headers : new Qt(i.headers)),
                i.params && (u = i.params instanceof Xn ? i.params : new Xn({ fromObject: i.params })),
                (o = new es(n, r, void 0 !== i.body ? i.body : null, {
                  headers: l,
                  context: i.context,
                  params: u,
                  reportProgress: i.reportProgress,
                  responseType: i.responseType || "json",
                  withCredentials: i.withCredentials,
                }));
            }
            const s = H(o).pipe(Ei(l => this.handler.handle(l)));
            if (n instanceof es || "events" === i.observe) return s;
            const a = s.pipe(xn(l => l instanceof Ri));
            switch (i.observe || "body") {
              case "body":
                switch (o.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      te(l => {
                        if (null !== l.body && !(l.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return l.body;
                      })
                    );
                  case "blob":
                    return a.pipe(
                      te(l => {
                        if (null !== l.body && !(l.body instanceof Blob)) throw new Error("Response is not a Blob.");
                        return l.body;
                      })
                    );
                  case "text":
                    return a.pipe(
                      te(l => {
                        if (null !== l.body && "string" != typeof l.body) throw new Error("Response is not a string.");
                        return l.body;
                      })
                    );
                  default:
                    return a.pipe(te(l => l.body));
                }
              case "response":
                return a;
              default:
                throw new Error(`Unreachable: unhandled observe type ${i.observe}}`);
            }
          }
          delete(n, r = {}) {
            return this.request("DELETE", n, r);
          }
          get(n, r = {}) {
            return this.request("GET", n, r);
          }
          head(n, r = {}) {
            return this.request("HEAD", n, r);
          }
          jsonp(n, r) {
            return this.request("JSONP", n, {
              params: new Xn().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(n, r = {}) {
            return this.request("OPTIONS", n, r);
          }
          patch(n, r, i = {}) {
            return this.request("PATCH", n, Qf(i, r));
          }
          post(n, r, i = {}) {
            return this.request("POST", n, Qf(i, r));
          }
          put(n, r, i = {}) {
            return this.request("PUT", n, Qf(i, r));
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(Dl));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function FE(e, t) {
        return t(e);
      }
      function fL(e, t) {
        return (n, r) => t.intercept(n, { handle: i => e(i, r) });
      }
      const pL = new A(""),
        ts = new A(""),
        kE = new A("");
      function gL() {
        let e = null;
        return (t, n) => (null === e && (e = (I(pL, { optional: !0 }) ?? []).reduceRight(fL, FE)), e(t, n));
      }
      let LE = (() => {
        class e extends Dl {
          constructor(n, r) {
            super(), (this.backend = n), (this.injector = r), (this.chain = null);
          }
          handle(n) {
            if (null === this.chain) {
              const r = Array.from(new Set([...this.injector.get(ts), ...this.injector.get(kE, [])]));
              this.chain = r.reduceRight(
                (i, o) =>
                  (function hL(e, t, n) {
                    return (r, i) => n.runInContext(() => t(r, o => e(o, i)));
                  })(i, o, this.injector),
                FE
              );
            }
            return this.chain(n, r => this.backend.handle(r));
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(Gf), M(ln));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const DL = /^\)\]\}',?\n/;
      let BE = (() => {
        class e {
          constructor(n) {
            this.xhrFactory = n;
          }
          handle(n) {
            if ("JSONP" === n.method) throw new D(-2800, !1);
            const r = (function wL() {
                const e = () => {};
                if (typeof Zone < "u") {
                  const t = Zone.current,
                    n = t.scheduleMacroTask("httpMacroTask", e, void 0, e, e);
                  return () => t.cancelTask(n);
                }
                return e;
              })(),
              i = this.xhrFactory;
            return (i.ɵloadImpl ? Oe(i.ɵloadImpl()) : H(null)).pipe(
              fn(
                () =>
                  new Ee(s => {
                    const a = i.build();
                    if (
                      (a.open(n.method, n.urlWithParams),
                      n.withCredentials && (a.withCredentials = !0),
                      n.headers.forEach((v, m) => a.setRequestHeader(v, m.join(","))),
                      n.headers.has("Accept") || a.setRequestHeader("Accept", "application/json, text/plain, */*"),
                      !n.headers.has("Content-Type"))
                    ) {
                      const v = n.detectContentTypeHeader();
                      null !== v && a.setRequestHeader("Content-Type", v);
                    }
                    if (n.responseType) {
                      const v = n.responseType.toLowerCase();
                      a.responseType = "json" !== v ? v : "text";
                    }
                    const l = n.serializeBody();
                    let u = null;
                    const c = () => {
                        if (null !== u) return u;
                        const v = a.statusText || "OK",
                          m = new Qt(a.getAllResponseHeaders()),
                          C =
                            (function _L(e) {
                              return "responseURL" in e && e.responseURL
                                ? e.responseURL
                                : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
                                ? e.getResponseHeader("X-Request-URL")
                                : null;
                            })(a) || n.url;
                        return (u = new Kf({ headers: m, status: a.status, statusText: v, url: C })), u;
                      },
                      d = () => {
                        let { headers: v, status: m, statusText: C, url: T } = c(),
                          x = null;
                        204 !== m && (x = typeof a.response > "u" ? a.responseText : a.response),
                          0 === m && (m = x ? 200 : 0);
                        let de = m >= 200 && m < 300;
                        if ("json" === n.responseType && "string" == typeof x) {
                          const Ie = x;
                          x = x.replace(DL, "");
                          try {
                            x = "" !== x ? JSON.parse(x) : null;
                          } catch (Zt) {
                            (x = Ie), de && ((de = !1), (x = { error: Zt, text: x }));
                          }
                        }
                        de
                          ? (s.next(new Ri({ body: x, headers: v, status: m, statusText: C, url: T || void 0 })),
                            s.complete())
                          : s.error(new xE({ error: x, headers: v, status: m, statusText: C, url: T || void 0 }));
                      },
                      f = v => {
                        const { url: m } = c(),
                          C = new xE({
                            error: v,
                            status: a.status || 0,
                            statusText: a.statusText || "Unknown Error",
                            url: m || void 0,
                          });
                        s.error(C), r();
                      };
                    let h = !1;
                    const p = v => {
                        h || (s.next(c()), (h = !0));
                        let m = { type: Te.DownloadProgress, loaded: v.loaded };
                        v.lengthComputable && (m.total = v.total),
                          "text" === n.responseType && a.responseText && (m.partialText = a.responseText),
                          s.next(m);
                      },
                      g = v => {
                        let m = { type: Te.UploadProgress, loaded: v.loaded };
                        v.lengthComputable && (m.total = v.total), s.next(m);
                      };
                    a.addEventListener("load", d),
                      a.addEventListener("error", f),
                      a.addEventListener("timeout", f),
                      a.addEventListener("abort", f),
                      n.reportProgress &&
                        (a.addEventListener("progress", p),
                        null !== l && a.upload && a.upload.addEventListener("progress", g));
                    const y = () => r();
                    a.addEventListener("loadend", y);
                    try {
                      a.send(l);
                    } catch (v) {
                      f(v);
                    }
                    return (
                      s.next({ type: Te.Sent }),
                      () => {
                        a.removeEventListener("loadend", y),
                          a.removeEventListener("error", f),
                          a.removeEventListener("abort", f),
                          a.removeEventListener("load", d),
                          a.removeEventListener("timeout", f),
                          r(),
                          n.reportProgress &&
                            (a.removeEventListener("progress", p),
                            null !== l && a.upload && a.upload.removeEventListener("progress", g)),
                          a.readyState !== a.DONE && a.abort();
                      }
                    );
                  })
              )
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(ew));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Zf = new A("XSRF_ENABLED"),
        VE = new A("XSRF_COOKIE_NAME", { providedIn: "root", factory: () => "XSRF-TOKEN" }),
        HE = new A("XSRF_HEADER_NAME", { providedIn: "root", factory: () => "X-XSRF-TOKEN" });
      class $E {}
      let bL = (() => {
        class e {
          constructor(n, r, i) {
            (this.doc = n),
              (this.platform = r),
              (this.cookieName = i),
              (this.lastCookieString = ""),
              (this.lastToken = null),
              (this.parseCount = 0);
          }
          getToken() {
            if ("server" === this.platform) return null;
            const n = this.doc.cookie || "";
            return (
              n !== this.lastCookieString &&
                (this.parseCount++, (this.lastToken = j_(n, this.cookieName)), (this.lastCookieString = n)),
              this.lastToken
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(et), M(pr), M(VE));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function SL(e, t) {
        const n = e.url.toLowerCase();
        if (!I(Zf) || "GET" === e.method || "HEAD" === e.method || n.startsWith("http://") || n.startsWith("https://"))
          return t(e);
        const r = I($E).getToken(),
          i = I(HE);
        return null != r && !e.headers.has(i) && (e = e.clone({ headers: e.headers.set(i, r) })), t(e);
      }
      var we = (() => (
        ((we = we || {})[(we.Interceptors = 0)] = "Interceptors"),
        (we[(we.LegacyInterceptors = 1)] = "LegacyInterceptors"),
        (we[(we.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
        (we[(we.NoXsrfProtection = 3)] = "NoXsrfProtection"),
        (we[(we.JsonpSupport = 4)] = "JsonpSupport"),
        (we[(we.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
        we
      ))();
      function Pi(e, t) {
        return { ɵkind: e, ɵproviders: t };
      }
      function ML(...e) {
        const t = [
          OE,
          BE,
          LE,
          { provide: Dl, useExisting: LE },
          { provide: Gf, useExisting: BE },
          { provide: ts, useValue: SL, multi: !0 },
          { provide: Zf, useValue: !0 },
          { provide: $E, useClass: bL },
        ];
        for (const n of e) t.push(...n.ɵproviders);
        return (function nc(e) {
          return { ɵproviders: e };
        })(t);
      }
      const UE = new A("LEGACY_INTERCEPTOR_FN");
      let IL = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = en({ type: e })),
          (e.ɵinj = jt({
            providers: [
              ML(
                Pi(we.LegacyInterceptors, [
                  { provide: UE, useFactory: gL },
                  { provide: ts, useExisting: UE, multi: !0 },
                ])
              ),
            ],
          })),
          e
        );
      })();
      const zE = new A("app_env");
      let qE = (() => {
          class e {
            constructor(n, r) {
              (this.env = n), (this.http = r), (this.headerOptions = { headers: new Qt({}) });
            }
            getPosts() {
              return (
                (this.headerOptions.params = { per_page: 9, page: 1 }),
                this.http.get(this.getPath("v2/posts"), this.headerOptions)
              );
            }
            getPortfolios() {
              return this.http.get(this.getPath("v2/portfolio"), this.headerOptions);
            }
            getPath(...n) {
              return [this.env.API_BASE_URL, ...n].join("/");
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(zE, 8), M(OE));
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        GE = (() => {
          class e {
            constructor(n, r) {
              (this.homeState = n), (this.homeApi = r);
            }
            getPosts$() {
              return this.homeState.posts$;
            }
            getPortfolio$() {
              return this.homeState.portfolios$;
            }
            loadPosts() {
              return this.homeApi.getPosts().pipe(
                $e(n => {
                  this.homeState.loadPosts(n?.slice(0, 6));
                })
              );
            }
            loadPortfolios() {
              return this.homeApi.getPortfolios().pipe(
                $e(n => {
                  this.homeState.loadPortfolios(n?.slice(0, 6));
                })
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(IE), M(qE));
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      function kL(e, t) {
        1 & e &&
          (w(0, "div", 10),
          lt(),
          w(1, "svg", 11),
          ae(2, "path", 12)(3, "path", 13),
          E(),
          gt(),
          w(4, "span", 14),
          N(5, "Loading..."),
          E()());
      }
      function LL(e, t) {
        if (
          (1 & e &&
            (w(0, "div", 16)(1, "span"),
            N(2),
            E(),
            w(3, "a", 17),
            N(4, "Check Here"),
            E(),
            w(5, "span"),
            N(6, " to visit posts"),
            E()()),
          2 & e)
        ) {
          const n = hi(2);
          yt(2), Na("", n.errorMsg, "!");
        }
      }
      function jL(e, t) {
        if ((1 & e && Dt(0, LL, 7, 1, "div", 15), 2 & e)) {
          const n = hi(),
            r = Eo(11);
          At("ngIf", n.errorMsg)("ngIfElse", r);
        }
      }
      function BL(e, t) {
        1 & e && zc(0);
      }
      const VL = function (e) {
        return { $implicit: e };
      };
      function HL(e, t) {
        if ((1 & e && (Sa(0), Dt(1, BL, 1, 0, "ng-container", 21), Ma()), 2 & e)) {
          const n = t.$implicit;
          hi(3);
          const r = Eo(15);
          yt(1), At("ngTemplateOutlet", r)("ngTemplateOutletContext", ad(2, VL, n));
        }
      }
      function $L(e, t) {
        if ((1 & e && (w(0, "div", 19), Dt(1, HL, 2, 4, "ng-container", 20), E()), 2 & e)) {
          const n = t.ngIf;
          yt(1), At("ngForOf", n);
        }
      }
      function UL(e, t) {
        if ((1 & e && (Dt(0, $L, 2, 1, "div", 18), ld(1, "async")), 2 & e)) {
          const n = hi(),
            r = Eo(13);
          At(
            "ngIf",
            (function aD(e, t, n) {
              const r = e + Z,
                i = _(),
                o = Vr(i, r);
              return Ro(i, r) ? nD(i, Qe(), t, o.transform, n, o) : o.transform(n);
            })(1, 2, n.posts$)
          )("ngIfElse", r);
        }
      }
      function zL(e, t) {
        1 & e && (w(0, "h4"), N(1, "Post is not found!"), E());
      }
      function qL(e, t) {
        if ((1 & e && ae(0, "div", 33), 2 & e)) {
          const n = hi().$implicit;
          Nt(
            "background-image:url(" +
              (null == n ? null : n.feature_images) +
              ");background-size:cover;background-position:center"
          );
        }
      }
      function GL(e, t) {
        1 & e && (w(0, "div", 34)(1, "span"), N(2, "No Preview Image"), E()());
      }
      function WL(e, t) {
        if (
          (1 & e &&
            (w(0, "div", 22)(1, "div", 23),
            Dt(2, qL, 1, 2, "div", 24),
            Dt(3, GL, 3, 0, "div", 25),
            w(4, "div", 26)(5, "div", 27)(6, "p", 28),
            N(7),
            ld(8, "date"),
            E()(),
            w(9, "p", 29),
            N(10),
            E(),
            w(11, "a", 30),
            N(12, " Read more "),
            lt(),
            w(13, "svg", 31),
            ae(14, "path", 32),
            E()()()()()),
          2 & e)
        ) {
          const n = t.$implicit;
          yt(2),
            At("ngIf", null == n ? null : n.feature_images),
            yt(1),
            At("ngIf", !(null != n && n.feature_images)),
            yt(4),
            bo(
              (function lD(e, t, n, r) {
                const i = e + Z,
                  o = _(),
                  s = Vr(o, i);
                return Ro(o, i) ? rD(o, Qe(), t, s.transform, n, r, s) : s.transform(n, r);
              })(8, 5, null == n ? null : n.date, "mediumDate")
            ),
            yt(3),
            bo(null == n || null == n.title ? null : n.title.rendered),
            yt(1),
            At("href", null == n ? null : n.link, tc);
        }
      }
      let KL = (() => {
          class e {
            constructor(n) {
              (this.homeFacade = n),
                (this.isLoading = !0),
                (this.errorMsg = ""),
                (this.posts$ = this.homeFacade.getPosts$());
            }
            ngOnInit() {
              this.loadPosts();
            }
            loadPosts() {
              (this.isLoading = !0),
                this.homeFacade.loadPosts().subscribe({
                  error: n => {
                    (this.isLoading = !1),
                      console.log("err", n),
                      (this.errorMsg = n?.error?.message || "Something is wrong");
                  },
                  complete: () => {
                    this.isLoading = !1;
                  },
                });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(L(GE));
            }),
            (e.ɵcmp = Jt({
              type: e,
              selectors: [["mia-home-blog"]],
              decls: 16,
              vars: 2,
              consts: [
                [1, "py-[70px]"],
                [1, "container"],
                [1, "flex", "items-center", "flex-wrap", "justify-between", "mb-5"],
                [1, "section_title"],
                [
                  "target",
                  "_blank",
                  "href",
                  "https://techincent.com/",
                  1,
                  "py-2",
                  "px-4",
                  "bg-teal-500",
                  "text-gray-900",
                  "font-semibold",
                  "rounded-lg",
                  "shadow-md",
                  "hover:bg-teal-700",
                  "focus:outline-none",
                  "focus:ring-2",
                  "focus:ring-teal-400",
                  "focus:ring-opacity-75",
                ],
                ["role", "status", 4, "ngIf", "ngIfElse"],
                ["content", ""],
                ["postContent", ""],
                ["emptyMsg", ""],
                ["postTemplate", ""],
                ["role", "status"],
                [
                  "aria-hidden",
                  "true",
                  "viewBox",
                  "0 0 100 101",
                  "fill",
                  "none",
                  "xmlns",
                  "http://www.w3.org/2000/svg",
                  1,
                  "inline",
                  "w-10",
                  "h-10",
                  "mr-2",
                  "text-gray-200",
                  "animate-spin",
                  "dark:text-gray-600",
                  "fill-blue-600",
                ],
                [
                  "d",
                  "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
                  "fill",
                  "currentColor",
                ],
                [
                  "d",
                  "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",
                  "fill",
                  "currentFill",
                ],
                [1, "sr-only"],
                [
                  "class",
                  "border border-red-400 px-4 py-3 rounded-lg relative",
                  "role",
                  "alert",
                  4,
                  "ngIf",
                  "ngIfElse",
                ],
                ["role", "alert", 1, "border", "border-red-400", "px-4", "py-3", "rounded-lg", "relative"],
                ["href", "https://techincent.com/", 1, "ml-4", "underline"],
                ["class", "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6", 4, "ngIf", "ngIfElse"],
                [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "gap-4", "xl:gap-6"],
                [4, "ngFor", "ngForOf"],
                [4, "ngTemplateOutlet", "ngTemplateOutletContext"],
                [1, "w-full", "bg-[#ecebe1]", "bg-opacity-10", "rounded-3xl", "shadow-xl", "overflow-hidden"],
                [1, "max-w-md", "mx-auto"],
                ["class", "h-[236px]", 3, "style", 4, "ngIf"],
                ["class", "h-[236px] flex items-center justify-center border-b border-teal-400/20", 4, "ngIf"],
                [1, "p-4", "sm:p-6"],
                [1, "flex", "flex-row"],
                [1, "text-[15px]", "font-bold", "text-[#0FB478]"],
                [1, "font-bold", "text-[18px]", "leading-7", "mb-3", "mt-2"],
                [
                  "target",
                  "_blank",
                  1,
                  "inline-flex",
                  "items-center",
                  "px-3",
                  "py-2",
                  "text-sm",
                  "font-medium",
                  "text-center",
                  "text-white",
                  "bg-blue-800",
                  "rounded-lg",
                  "hover:bg-blue-900",
                  "focus:ring-4",
                  "focus:outline-none",
                  "focus:ring-blue-300",
                  "dark:bg-blue-600",
                  "dark:hover:bg-blue-700",
                  "dark:focus:ring-blue-800",
                  3,
                  "href",
                ],
                [
                  "aria-hidden",
                  "true",
                  "xmlns",
                  "http://www.w3.org/2000/svg",
                  "fill",
                  "none",
                  "viewBox",
                  "0 0 14 10",
                  1,
                  "w-3.5",
                  "h-3.5",
                  "ml-2",
                ],
                [
                  "stroke",
                  "currentColor",
                  "stroke-linecap",
                  "round",
                  "stroke-linejoin",
                  "round",
                  "stroke-width",
                  "2",
                  "d",
                  "M1 5h12m0 0L9 1m4 4L9 9",
                ],
                [1, "h-[236px]"],
                [1, "h-[236px]", "flex", "items-center", "justify-center", "border-b", "border-teal-400/20"],
              ],
              template: function (n, r) {
                if (
                  (1 & n &&
                    (w(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3),
                    N(4, "Latest Blogs"),
                    E(),
                    w(5, "a", 4),
                    N(6, "View All"),
                    E()(),
                    Dt(7, kL, 6, 0, "div", 5),
                    E()(),
                    Dt(8, jL, 1, 2, "ng-template", null, 6, Po),
                    Dt(10, UL, 2, 4, "ng-template", null, 7, Po),
                    Dt(12, zL, 2, 0, "ng-template", null, 8, Po),
                    Dt(14, WL, 15, 8, "ng-template", null, 9, Po)),
                  2 & n)
                ) {
                  const i = Eo(9);
                  yt(7), At("ngIf", r.isLoading)("ngIfElse", i);
                }
              },
              dependencies: [nf, U_, G_, W_, K_],
            })),
            e
          );
        })(),
        QL = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Jt({
              type: e,
              selectors: [["mia-hero"]],
              decls: 36,
              vars: 0,
              consts: [
                [1, "hero_area", "bg-theme-2"],
                [1, "container"],
                [1, "hero_title"],
                [1, "hero_title_sub"],
                [1, "hero_illustrator"],
                [1, "hero_avatar"],
                [1, "hero_avatar_img"],
                ["src", "assets/avatar.png", "alt", ""],
                [1, "hero_details"],
                ["href", "https://techincent.com", 1, "hover:underline"],
                [1, "social_media"],
                ["target", "_blank", "href", "https://www.linkedin.com/in/sajalmia381"],
                [
                  "xmlns",
                  "http://www.w3.org/2000/svg",
                  "viewBox",
                  "0 0 24 24",
                  "fill",
                  "currentColor",
                  "aria-hidden",
                  "true",
                  1,
                  "h-7",
                  "w-7",
                ],
                [
                  "d",
                  "M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z",
                ],
                ["target", "_blank", "href", "https://github.com/sajalmia381"],
                [
                  "xmlns",
                  "http://www.w3.org/2000/svg",
                  "viewBox",
                  "0 0 16 16",
                  "fill",
                  "currentColor",
                  "aria-hidden",
                  "true",
                  1,
                  "h-6",
                  "w-6",
                ],
                [
                  "d",
                  "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z",
                ],
                ["target", "_blank", "href", "https://www.npmjs.com/~sajalmia381", 1, "mt-[2px]"],
                ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 400 400", 1, "h-6", "w-6"],
                [
                  "fill",
                  "transparent",
                  "stroke-width",
                  "1",
                  "d",
                  "M69 69c262 0 0 0 0 0v262h131V121h59c4.17 0 16.63-1.2 18.98 2.31 1.23 1.85 1.02 5.5 1.02 7.69v200h52V69Z",
                ],
                [
                  "fill",
                  "currentColor",
                  "stroke-width",
                  "1",
                  "d",
                  "M0 0h400v400H0V0Zm331 69H69v262h131V121h59c4.17 0 16.63-1.2 18.98 2.31 1.23 1.85 1.02 5.5 1.02 7.69v200h52V69Z",
                ],
                [1, "scroll-down"],
              ],
              template: function (n, r) {
                1 & n &&
                  (w(0, "section", 0)(1, "div", 1)(2, "h2", 2)(3, "span", 3),
                  N(4, "Hay! This is Sajal Mia,"),
                  E(),
                  ae(5, "br"),
                  N(6, " Professional Software Engineer "),
                  E(),
                  ae(7, "div", 4),
                  w(8, "div", 5)(9, "div", 6),
                  ae(10, "img", 7),
                  E()(),
                  w(11, "div", 8)(12, "p"),
                  N(
                    13,
                    " At this time I have more than six years of working experiences as Software Engineer. Currently I am working as a Senior Software Engineer at KloverCloud for three years. My responsibility at KloverCloud, improves and implement new features at their saas platform, lead UI products. I've also write blog post at "
                  ),
                  w(14, "a", 9),
                  N(15, "TechIncent"),
                  E()(),
                  w(16, "p"),
                  N(
                    17,
                    " Well, I would describe myself as somebody who is positive, happy and also resilient. I would say I'm the type of person who always puts the needs of a team first. I am a creative problem solver. I always embraces positive change. I am trustworthy and reliable. "
                  ),
                  E(),
                  w(18, "p"),
                  N(
                    19,
                    " Outside of computer, I like to keep myself fit and active. Which in turn improves my concentration levels whilst. "
                  ),
                  E(),
                  w(20, "ul", 10)(21, "li")(22, "a", 11),
                  lt(),
                  w(23, "svg", 12),
                  ae(24, "path", 13),
                  E()()(),
                  gt(),
                  w(25, "li")(26, "a", 14),
                  lt(),
                  w(27, "svg", 15),
                  ae(28, "path", 16),
                  E()()(),
                  gt(),
                  w(29, "li")(30, "a", 17),
                  lt(),
                  w(31, "svg", 18),
                  ae(32, "path", 19)(33, "path", 20),
                  E()()()()()(),
                  gt(),
                  w(34, "div", 21),
                  ae(35, "span"),
                  E()());
              },
              styles: [
                '.hero_area[_ngcontent-%COMP%]{min-height:100vh;display:flex;flex-direction:column;border-radius:0 0 80px}.hero_title[_ngcontent-%COMP%]{width:100%;z-index:30;position:relative;font-size:26px;line-height:36px;margin-top:70px;margin-bottom:30px}.hero_details[_ngcontent-%COMP%]{font-size:16px;margin-top:10px}.hero_details[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-top:16px}.hero_illustrator[_ngcontent-%COMP%]{visibility:hidden;opacity:0;min-width:300px;min-height:300px;position:absolute;z-index:-1}.hero_illustrator[_ngcontent-%COMP%]:before{position:absolute;content:"";background-color:#18033c;border-radius:10px 10px 200px 200px;height:100%;width:100%;animation:scale-background 3s cubic-bezier(0,.45,.15,1);opacity:.05}.hero_avatar[_ngcontent-%COMP%]{visibility:hidden;opacity:0;position:absolute;margin:15px 0 0 20px;z-index:-1}.hero_avatar_img[_ngcontent-%COMP%]{position:relative;border-radius:50%;width:260px}.hero_avatar_img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border-radius:50%;position:relative;z-index:2}.hero_avatar_img[_ngcontent-%COMP%]:before{content:"";position:absolute;z-index:0;left:50%;top:50%;transform:translate(-50%) translateY(-50%);display:block;width:100%;height:100%;border-radius:50%;animation:pulse-border 2s ease-out infinite;--tw-bg-opacity: 1;background-color:rgb(45 212 191 / var(--tw-bg-opacity))}.scroll-down[_ngcontent-%COMP%]{transform:translate(-50%);height:48px;width:30px;text-align:center;line-height:44px;border-radius:58px;border:1px solid;z-index:10;color:#f9f9f9;display:flex;justify-content:center;margin:auto auto 30px}.scroll-down[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block;height:8px;width:4px;border-radius:4px;background:#f9f9f9;margin-top:8px;animation:scroll-down 3s infinite}.social_media[_ngcontent-%COMP%]{display:flex;column-gap:1.3rem;margin-top:40px}.social_media[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:inline-block}.social_media[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{transition:all .2s cubic-bezier(.075,.82,.165,1)}.social_media[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%]{transform:scale(1.2)}@media (min-width: 576px){.hero_title[_ngcontent-%COMP%]{font-size:5vw;line-height:6vw}}@media (min-width: 1200px){.hero_title[_ngcontent-%COMP%]{margin-bottom:60px}.hero_illustrator[_ngcontent-%COMP%], .hero_avatar[_ngcontent-%COMP%]{visibility:visible;opacity:1;z-index:1}.hero_details[_ngcontent-%COMP%]{width:calc(100% - 410px);margin-left:410px;margin-bottom:80px}}@media (min-width: 1440px){.hero_details[_ngcontent-%COMP%]{font-size:1.2rem}}',
              ],
            })),
            e
          );
        })(),
        ZL = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Jt({
              type: e,
              selectors: [["mia-experience"]],
              decls: 82,
              vars: 0,
              consts: [
                [1, "experience_area"],
                [1, "container"],
                [1, "flex", "items-center", "flex-wrap", "justify-between", "mb-6"],
                [1, "section_title"],
                [1, "experience_list"],
                [1, "experience_item"],
                [1, "experience_period"],
                [1, "experience_content"],
                ["target", "_blank", "href", "https://klovercloud.com", 1, "experience_title_link"],
                [1, "experience_title"],
                ["xmlns", "http://www.w3.org/2000/svg", "height", "1em", "viewBox", "0 0 512 512", 1, "ml-2"],
                [
                  "fill",
                  "#fff",
                  "d",
                  "M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z",
                ],
                [1, "experience_desc"],
                [1, "skill_list"],
                ["target", "_blank", "href", "https://movit.ch", 1, "experience_title_link"],
                ["target", "_blank", "href", "https://themeim.com", 1, "experience_title_link"],
              ],
              template: function (n, r) {
                1 & n &&
                  (w(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3),
                  N(4, "Experiences"),
                  E()(),
                  w(5, "div", 4)(6, "div", 5)(7, "div", 6),
                  N(8, "Feb 2021 \u2014 Present"),
                  E(),
                  w(9, "div", 7)(10, "a", 8)(11, "h2", 9),
                  N(12, "Senior Software Engineer - KloverCloud"),
                  E(),
                  lt(),
                  w(13, "svg", 10),
                  ae(14, "path", 11),
                  E()(),
                  gt(),
                  w(15, "p", 12),
                  N(
                    16,
                    " Dockerize angular application, deployment in Kubernetes cluster \u2022 Angular project architecture \u2022 Implement JWT, SSO authentication \u2022 Design and develop role based permission \u2022 Implement Websocket base component \u2022 Implement angular role based guards(CanActivate, CanDeactive, Resolve) \u2022 Design and develop custom library components \u2022 Design dark and light theme \u2022 Optimize and improve application performance \u2022 Update angular version \u2022 Manage and maintain angular project "
                  ),
                  E(),
                  w(17, "ul", 13)(18, "li"),
                  N(19, "Angular"),
                  E(),
                  w(20, "li"),
                  N(21, "TypeScript"),
                  E(),
                  w(22, "li"),
                  N(23, "Project Architecture"),
                  E(),
                  w(24, "li"),
                  N(25, "JSON Web Token (JWT)"),
                  E(),
                  w(26, "li"),
                  N(27, "Role-Based Access Control (RBAC)"),
                  E(),
                  w(28, "li"),
                  N(29, "Angular Material"),
                  E(),
                  w(30, "li"),
                  N(31, "Tailwindcss"),
                  E(),
                  w(32, "li"),
                  N(33, "Micro-Frontend"),
                  E(),
                  w(34, "li"),
                  N(35, "Docker"),
                  E(),
                  w(36, "li"),
                  N(37, "Kubernetes"),
                  E()()()(),
                  w(38, "div", 5)(39, "div", 6),
                  N(40, "Feb 2023 \u2014 July 2023"),
                  E(),
                  w(41, "div", 7)(42, "a", 14)(43, "h2", 9),
                  N(44, "Senior Angular Engineer - MovIT | Remote"),
                  E(),
                  lt(),
                  w(45, "svg", 10),
                  ae(46, "path", 11),
                  E()(),
                  gt(),
                  w(47, "p", 12),
                  N(48, "Implement and maintain MovIT Angular UI core libraries"),
                  E(),
                  w(49, "ul", 13)(50, "li"),
                  N(51, "Nx"),
                  E(),
                  w(52, "li"),
                  N(53, "Angular"),
                  E(),
                  w(54, "li"),
                  N(55, "Project Architecture"),
                  E(),
                  w(56, "li"),
                  N(57, "Micro Fronted Architecture"),
                  E(),
                  w(58, "li"),
                  N(59, "Npm Package"),
                  E()()()(),
                  w(60, "div", 5)(61, "div", 6),
                  N(62, "Sep 2017 \u2014 Jun 2018"),
                  E(),
                  w(63, "div", 7)(64, "a", 15)(65, "h2", 9),
                  N(66, "Frontend Engineer - ThemeIM"),
                  E(),
                  lt(),
                  w(67, "svg", 10),
                  ae(68, "path", 11),
                  E()(),
                  gt(),
                  w(69, "p", 12),
                  N(70, "Develop their client base website and ThemeForest-based Templates."),
                  E(),
                  w(71, "ul", 13)(72, "li"),
                  N(73, "HTML5"),
                  E(),
                  w(74, "li"),
                  N(75, "CSS"),
                  E(),
                  w(76, "li"),
                  N(77, "JavaScript"),
                  E(),
                  w(78, "li"),
                  N(79, "Bootstrap"),
                  E(),
                  w(80, "li"),
                  N(81, "Gulp"),
                  E()()()()()()());
              },
              styles: [
                ".experience_area[_ngcontent-%COMP%]{padding-bottom:70px;padding-top:70px}.experience_list[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:2rem}.experience_desc[_ngcontent-%COMP%]{font-size:.95rem;margin-top:6px}.experience_item[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:14px}.experience_period[_ngcontent-%COMP%]{flex:none;width:200px;line-height:calc(1.2rem + 10px)}.experience_title[_ngcontent-%COMP%]{font-size:1.2rem;line-height:calc(1.2rem + 10px)}.experience_title_link[_ngcontent-%COMP%]{display:flex;align-items:center;flex-wrap:wrap}@media (min-width: 768px){.experience_item[_ngcontent-%COMP%]{flex-direction:row}}@media (min-width: 992px){.experience_period[_ngcontent-%COMP%]{width:300px}}.skill_list[_ngcontent-%COMP%]{margin-top:.8rem;gap:5px;display:inline-flex;flex-wrap:wrap}.skill_list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{border-radius:9999px;background-color:#2dd4bf66;padding:.25rem .75rem;font-size:.75rem;font-weight:500;line-height:1.25rem;--tw-text-opacity: 1;color:rgb(94 234 212 / var(--tw-text-opacity))}",
              ],
            })),
            e
          );
        })();
      const YL = function (e) {
        return { width: e };
      };
      function XL(e, t) {
        if ((1 & e && (w(0, "div", 6)(1, "div", 7), N(2), E(), w(3, "div", 8), ae(4, "div", 9), E()()), 2 & e)) {
          const n = t.$implicit;
          yt(2), bo(n.name), yt(2), Nt(ad(4, YL, n.wight + "%")), At("ngClass", n.progressBarColor || "bg-green-400");
        }
      }
      let JL = (() => {
          class e {
            constructor() {
              this.skill_list = [
                { name: "HTML", wight: 90 },
                { name: "CSS", wight: 90, progressBarColor: "bg-purple-500" },
                { name: "SASS", wight: 90, progressBarColor: "bg-yellow-500" },
                { name: "Javascript", wight: 90 },
                { name: "TypeScript", wight: 80, progressBarColor: "bg-purple-500" },
                { name: "Jquery", wight: 60, progressBarColor: "bg-yellow-500" },
                { name: "Angular", wight: 90 },
                { name: "Angular Material", wight: 85, progressBarColor: "bg-purple-500" },
                { name: "RxJs", wight: 80, progressBarColor: "bg-yellow-500" },
                { name: "NGRX", wight: 70 },
                { name: "Tailwindcss", wight: 90, progressBarColor: "bg-purple-500" },
                { name: "Bootstrap", wight: 90, progressBarColor: "bg-yellow-500" },
                { name: "NX", wight: 70 },
                { name: "Node", wight: 70, progressBarColor: "bg-purple-500" },
                { name: "Express", wight: 70, progressBarColor: "bg-yellow-500" },
                { name: "Git", wight: 90 },
                { name: "Docker", wight: 40, progressBarColor: "bg-purple-500" },
                { name: "Kubernetes", wight: 30, progressBarColor: "bg-yellow-500" },
              ];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Jt({
              type: e,
              selectors: [["mia-skill"]],
              decls: 7,
              vars: 1,
              consts: [
                [1, "skill_area", "bg-theme-2"],
                [1, "container"],
                [1, "flex", "items-center", "flex-wrap", "justify-between", "mb-6"],
                [1, "section_title"],
                [1, "skill_list"],
                ["class", "skill_item", 4, "ngFor", "ngForOf"],
                [1, "skill_item"],
                [1, "mb-1", "text-lg", "font-medium", "dark:text-white"],
                [1, "w-full", "bg-gray-200", "rounded-full", "h-2", "mb-4", "dark:bg-gray-700"],
                [1, "h-2", "rounded-full", 3, "ngClass"],
              ],
              template: function (n, r) {
                1 & n &&
                  (w(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3),
                  N(4, "My Skills"),
                  E()(),
                  w(5, "div", 4),
                  Dt(6, XL, 5, 6, "div", 5),
                  E()()()),
                  2 & n && (yt(6), At("ngForOf", r.skill_list));
              },
              dependencies: [V_, nf],
              styles: [
                ".skill_area[_ngcontent-%COMP%]{padding:80px 0;border-radius:65px 0}.skill_list[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:1rem}@media (min-width: 576px){.skill_list[_ngcontent-%COMP%]{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (min-width: 992px){.skill_list[_ngcontent-%COMP%]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.5rem}}",
              ],
            })),
            e
          );
        })(),
        e2 = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Jt({
              type: e,
              selectors: [["mia-contact"]],
              decls: 45,
              vars: 0,
              consts: [
                [1, "contact_area", "bg-theme-2"],
                [1, "container"],
                [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-8"],
                [1, "contact_intro"],
                [1, "text-2xl", "xl:text-4xl", "font-bold"],
                [1, "mt-2"],
                [1, "flex", "items-center", "gap-4", "shadow", "shadow-teal-400/5", "bg-teal-400/5", "p-4", "mt-4"],
                [1, "flex-none", "bg-teal-400/20", "h-10", "w-10", "rounded", "flex", "items-center", "justify-center"],
                ["xmlns", "http://www.w3.org/2000/svg", "height", "24", "viewBox", "0 -960 960 960", "width", "24"],
                [
                  "fill",
                  "currentColor",
                  "d",
                  "M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z",
                ],
                [1, "flex-auto", "flex", "flex-col"],
                ["href", "mailto:sajalmia.official@gmail.com", "target", "_blank", 1, "text-primary"],
                [
                  "fill",
                  "currentColor",
                  "d",
                  "M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z",
                ],
                ["href", "callto:+8801742353078", "target", "_blank", 1, "text-primary"],
                [1, "contact"],
                [1, "text-2xl", "xl:text-4xl", "font-bold", "mb-4"],
                [1, "w-full", "max-w-lg"],
                [1, "mb-6", "md:mb-0"],
                [
                  "type",
                  "text",
                  "placeholder",
                  "Full Name *",
                  1,
                  "appearance-none",
                  "block",
                  "w-full",
                  "bg-teal-400/5",
                  "border",
                  "border-transparent",
                  "rounded",
                  "py-3",
                  "px-4",
                  "mb-3",
                  "leading-tight",
                  "focus:outline-none",
                  "focus:bg-teal-400/10",
                ],
                [
                  "type",
                  "text",
                  "placeholder",
                  "Email address *",
                  1,
                  "appearance-none",
                  "block",
                  "w-full",
                  "bg-teal-400/5",
                  "border",
                  "border-transparent",
                  "rounded",
                  "py-3",
                  "px-4",
                  "mb-3",
                  "leading-tight",
                  "focus:outline-none",
                  "focus:bg-teal-400/10",
                ],
                [1, "mb-8", "md:mb-0"],
                [
                  "type",
                  "text",
                  "placeholder",
                  "Subject *",
                  1,
                  "appearance-none",
                  "block",
                  "w-full",
                  "bg-teal-400/5",
                  "border",
                  "border-transparent",
                  "rounded",
                  "py-3",
                  "px-4",
                  "mb-3",
                  "leading-tight",
                  "focus:outline-none",
                  "focus:bg-teal-400/10",
                ],
                [1, "block", "tracking-wide", "font-bold", "mb-2"],
                [
                  "rows",
                  "3",
                  "type",
                  "text",
                  1,
                  "appearance-none",
                  "block",
                  "w-full",
                  "bg-teal-400/5",
                  "border",
                  "border-transparent",
                  "rounded",
                  "py-3",
                  "px-4",
                  "mb-3",
                  "leading-tight",
                  "focus:outline-none",
                  "focus:bg-teal-400/10",
                  "resize-none",
                ],
                [
                  "type",
                  "button",
                  1,
                  "text-gray-900",
                  "bg-primary",
                  "hover:bg-teal-500",
                  "focus:ring-2",
                  "focus:bg-teal-600",
                  "font-medium",
                  "rounded-md",
                  "px-8",
                  "py-2",
                  "mr-2",
                  "mb-2",
                  "focus:outline-none",
                ],
              ],
              template: function (n, r) {
                1 & n &&
                  (w(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "h2", 4),
                  N(5, " Let's Chat. "),
                  ae(6, "br"),
                  N(7, " Tell me about your project "),
                  E(),
                  w(8, "p", 5),
                  N(9, "Let's create something together \u{1f91f}"),
                  E(),
                  w(10, "div", 6)(11, "div", 7),
                  lt(),
                  w(12, "svg", 8),
                  ae(13, "path", 9),
                  E()(),
                  gt(),
                  w(14, "div", 10)(15, "h6"),
                  N(16, "Mail Me At"),
                  E(),
                  w(17, "a", 11),
                  N(18, "sajalmia.official@gmail.com"),
                  E()()(),
                  w(19, "div", 6)(20, "div", 7),
                  lt(),
                  w(21, "svg", 8),
                  ae(22, "path", 12),
                  E()(),
                  gt(),
                  w(23, "div", 10)(24, "h6"),
                  N(25, "Call Me At"),
                  E(),
                  w(26, "a", 13),
                  N(27, "+8801742353078"),
                  E()()()(),
                  w(28, "div", 14)(29, "h2", 15),
                  N(30, "Send me a message \u{1f680}"),
                  E(),
                  w(31, "form", 16)(32, "div", 17),
                  ae(33, "input", 18),
                  E(),
                  w(34, "div", 17),
                  ae(35, "input", 19),
                  E(),
                  w(36, "div", 20),
                  ae(37, "input", 21),
                  E(),
                  w(38, "div", 17)(39, "label", 22),
                  N(40, " Tell me more about your project * "),
                  E(),
                  w(41, "textarea", 23),
                  N(42, "            "),
                  E()(),
                  w(43, "button", 24),
                  N(44, " Send message "),
                  E()()()()()());
              },
              styles: [".contact_area[_ngcontent-%COMP%]{padding:80px 0;border-radius:65px 0 0}"],
            })),
            e
          );
        })(),
        t2 = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Jt({
              type: e,
              selectors: [["mia-footer"]],
              decls: 19,
              vars: 0,
              consts: [
                [1, "py-16", "bg-theme-2", "border-t", "border-teal-400/30"],
                [1, "container"],
                [1, "flex", "flex-col", "items-center", "justify-center"],
                [1, "social_media"],
                ["target", "_blank", "href", "https://www.linkedin.com/in/sajalmia381"],
                [
                  "xmlns",
                  "http://www.w3.org/2000/svg",
                  "viewBox",
                  "0 0 24 24",
                  "fill",
                  "currentColor",
                  "aria-hidden",
                  "true",
                  1,
                  "h-7",
                  "w-7",
                ],
                [
                  "d",
                  "M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z",
                ],
                ["target", "_blank", "href", "https://github.com/sajalmia381"],
                [
                  "xmlns",
                  "http://www.w3.org/2000/svg",
                  "viewBox",
                  "0 0 16 16",
                  "fill",
                  "currentColor",
                  "aria-hidden",
                  "true",
                  1,
                  "h-6",
                  "w-6",
                ],
                [
                  "d",
                  "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z",
                ],
                ["target", "_blank", "href", "https://www.npmjs.com/~sajalmia381", 1, "mt-[2px]"],
                ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 400 400", 1, "h-6", "w-6"],
                [
                  "fill",
                  "transparent",
                  "stroke-width",
                  "1",
                  "d",
                  "M69 69c262 0 0 0 0 0v262h131V121h59c4.17 0 16.63-1.2 18.98 2.31 1.23 1.85 1.02 5.5 1.02 7.69v200h52V69Z",
                ],
                [
                  "fill",
                  "currentColor",
                  "stroke-width",
                  "1",
                  "d",
                  "M0 0h400v400H0V0Zm331 69H69v262h131V121h59c4.17 0 16.63-1.2 18.98 2.31 1.23 1.85 1.02 5.5 1.02 7.69v200h52V69Z",
                ],
                [1, "mt-8"],
              ],
              template: function (n, r) {
                1 & n &&
                  (w(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "ul", 3)(4, "li")(5, "a", 4),
                  lt(),
                  w(6, "svg", 5),
                  ae(7, "path", 6),
                  E()()(),
                  gt(),
                  w(8, "li")(9, "a", 7),
                  lt(),
                  w(10, "svg", 8),
                  ae(11, "path", 9),
                  E()()(),
                  gt(),
                  w(12, "li")(13, "a", 10),
                  lt(),
                  w(14, "svg", 11),
                  ae(15, "path", 12)(16, "path", 13),
                  E()()()(),
                  gt(),
                  w(17, "p", 14),
                  N(18, "\xa9 Md. Sajal Mia 2023"),
                  E()()()());
              },
              styles: [
                ".social_media[_ngcontent-%COMP%]{display:flex;column-gap:1.3rem}.social_media[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:inline-block}.social_media[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{transition:all .2s cubic-bezier(.075,.82,.165,1)}.social_media[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%]{transform:scale(1.2)}",
              ],
            })),
            e
          );
        })(),
        n2 = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Jt({
              type: e,
              selectors: [["mia-home"]],
              decls: 6,
              vars: 0,
              template: function (n, r) {
                1 & n &&
                  ae(0, "mia-hero")(1, "mia-experience")(2, "mia-skill")(3, "mia-home-blog")(4, "mia-contact")(
                    5,
                    "mia-footer"
                  );
              },
              dependencies: [KL, QL, ZL, JL, e2, t2],
              styles: ["[_nghost-%COMP%]{display:block}"],
            })),
            e
          );
        })(),
        r2 = (() => {
          class e {
            constructor() {
              this.title = "Md. Sajal Mia | Resume";
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Jt({
              type: e,
              selectors: [["mia-root"]],
              decls: 1,
              vars: 0,
              template: function (n, r) {
                1 & n && ae(0, "mia-home");
              },
              dependencies: [n2],
            })),
            e
          );
        })();
      class WE {}
      class i2 {}
      const kn = "*";
      function KE(e, t = null) {
        return { type: 2, steps: e, options: t };
      }
      function QE(e) {
        return { type: 6, styles: e, offset: null };
      }
      function ZE(e) {
        Promise.resolve().then(e);
      }
      class rs {
        constructor(t = 0, n = 0) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this._started = !1),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._position = 0),
            (this.parentPlayer = null),
            (this.totalTime = t + n);
        }
        _onFinish() {
          this._finished || ((this._finished = !0), this._onDoneFns.forEach(t => t()), (this._onDoneFns = []));
        }
        onStart(t) {
          this._originalOnStartFns.push(t), this._onStartFns.push(t);
        }
        onDone(t) {
          this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        hasStarted() {
          return this._started;
        }
        init() {}
        play() {
          this.hasStarted() || (this._onStart(), this.triggerMicrotask()), (this._started = !0);
        }
        triggerMicrotask() {
          ZE(() => this._onFinish());
        }
        _onStart() {
          this._onStartFns.forEach(t => t()), (this._onStartFns = []);
        }
        pause() {}
        restart() {}
        finish() {
          this._onFinish();
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this.hasStarted() || this._onStart(),
            this.finish(),
            this._onDestroyFns.forEach(t => t()),
            (this._onDestroyFns = []));
        }
        reset() {
          (this._started = !1),
            (this._finished = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        setPosition(t) {
          this._position = this.totalTime ? t * this.totalTime : 1;
        }
        getPosition() {
          return this.totalTime ? this._position / this.totalTime : 1;
        }
        triggerCallback(t) {
          const n = "start" == t ? this._onStartFns : this._onDoneFns;
          n.forEach(r => r()), (n.length = 0);
        }
      }
      class YE {
        constructor(t) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._onDestroyFns = []),
            (this.parentPlayer = null),
            (this.totalTime = 0),
            (this.players = t);
          let n = 0,
            r = 0,
            i = 0;
          const o = this.players.length;
          0 == o
            ? ZE(() => this._onFinish())
            : this.players.forEach(s => {
                s.onDone(() => {
                  ++n == o && this._onFinish();
                }),
                  s.onDestroy(() => {
                    ++r == o && this._onDestroy();
                  }),
                  s.onStart(() => {
                    ++i == o && this._onStart();
                  });
              }),
            (this.totalTime = this.players.reduce((s, a) => Math.max(s, a.totalTime), 0));
        }
        _onFinish() {
          this._finished || ((this._finished = !0), this._onDoneFns.forEach(t => t()), (this._onDoneFns = []));
        }
        init() {
          this.players.forEach(t => t.init());
        }
        onStart(t) {
          this._onStartFns.push(t);
        }
        _onStart() {
          this.hasStarted() || ((this._started = !0), this._onStartFns.forEach(t => t()), (this._onStartFns = []));
        }
        onDone(t) {
          this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this.parentPlayer || this.init(), this._onStart(), this.players.forEach(t => t.play());
        }
        pause() {
          this.players.forEach(t => t.pause());
        }
        restart() {
          this.players.forEach(t => t.restart());
        }
        finish() {
          this._onFinish(), this.players.forEach(t => t.finish());
        }
        destroy() {
          this._onDestroy();
        }
        _onDestroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._onFinish(),
            this.players.forEach(t => t.destroy()),
            this._onDestroyFns.forEach(t => t()),
            (this._onDestroyFns = []));
        }
        reset() {
          this.players.forEach(t => t.reset()), (this._destroyed = !1), (this._finished = !1), (this._started = !1);
        }
        setPosition(t) {
          const n = t * this.totalTime;
          this.players.forEach(r => {
            const i = r.totalTime ? Math.min(1, n / r.totalTime) : 1;
            r.setPosition(i);
          });
        }
        getPosition() {
          const t = this.players.reduce((n, r) => (null === n || r.totalTime > n.totalTime ? r : n), null);
          return null != t ? t.getPosition() : 0;
        }
        beforeDestroy() {
          this.players.forEach(t => {
            t.beforeDestroy && t.beforeDestroy();
          });
        }
        triggerCallback(t) {
          const n = "start" == t ? this._onStartFns : this._onDoneFns;
          n.forEach(r => r()), (n.length = 0);
        }
      }
      const Yf = "!";
      function XE(e) {
        return new D(3e3, !1);
      }
      function Jn(e) {
        switch (e.length) {
          case 0:
            return new rs();
          case 1:
            return e[0];
          default:
            return new YE(e);
        }
      }
      function JE(e, t, n = new Map(), r = new Map()) {
        const i = [],
          o = [];
        let s = -1,
          a = null;
        if (
          (t.forEach(l => {
            const u = l.get("offset"),
              c = u == s,
              d = (c && a) || new Map();
            l.forEach((f, h) => {
              let p = h,
                g = f;
              if ("offset" !== h)
                switch (((p = e.normalizePropertyName(p, i)), g)) {
                  case Yf:
                    g = n.get(h);
                    break;
                  case kn:
                    g = r.get(h);
                    break;
                  default:
                    g = e.normalizeStyleValue(h, p, g, i);
                }
              d.set(p, g);
            }),
              c || o.push(d),
              (a = d),
              (s = u);
          }),
          i.length)
        )
          throw (function T2(e) {
            return new D(3502, !1);
          })();
        return o;
      }
      function Xf(e, t, n, r) {
        switch (t) {
          case "start":
            e.onStart(() => r(n && Jf(n, "start", e)));
            break;
          case "done":
            e.onDone(() => r(n && Jf(n, "done", e)));
            break;
          case "destroy":
            e.onDestroy(() => r(n && Jf(n, "destroy", e)));
        }
      }
      function Jf(e, t, n) {
        const o = eh(
            e.element,
            e.triggerName,
            e.fromState,
            e.toState,
            t || e.phaseName,
            n.totalTime ?? e.totalTime,
            !!n.disabled
          ),
          s = e._data;
        return null != s && (o._data = s), o;
      }
      function eh(e, t, n, r, i = "", o = 0, s) {
        return { element: e, triggerName: t, fromState: n, toState: r, phaseName: i, totalTime: o, disabled: !!s };
      }
      function Et(e, t, n) {
        let r = e.get(t);
        return r || e.set(t, (r = n)), r;
      }
      function eC(e) {
        const t = e.indexOf(":");
        return [e.substring(1, t), e.slice(t + 1)];
      }
      const B2 = (() => (typeof document > "u" ? null : document.documentElement))();
      function th(e) {
        const t = e.parentNode || e.host || null;
        return t === B2 ? null : t;
      }
      let Tr = null,
        tC = !1;
      function nC(e, t) {
        for (; t; ) {
          if (t === e) return !0;
          t = th(t);
        }
        return !1;
      }
      function rC(e, t, n) {
        if (n) return Array.from(e.querySelectorAll(t));
        const r = e.querySelector(t);
        return r ? [r] : [];
      }
      let iC = (() => {
          class e {
            validateStyleProperty(n) {
              return (function H2(e) {
                Tr ||
                  ((Tr =
                    (function $2() {
                      return typeof document < "u" ? document.body : null;
                    })() || {}),
                  (tC = !!Tr.style && "WebkitAppearance" in Tr.style));
                let t = !0;
                return (
                  Tr.style &&
                    !(function V2(e) {
                      return "ebkit" == e.substring(1, 6);
                    })(e) &&
                    ((t = e in Tr.style),
                    !t && tC && (t = "Webkit" + e.charAt(0).toUpperCase() + e.slice(1) in Tr.style)),
                  t
                );
              })(n);
            }
            matchesElement(n, r) {
              return !1;
            }
            containsElement(n, r) {
              return nC(n, r);
            }
            getParentElement(n) {
              return th(n);
            }
            query(n, r, i) {
              return rC(n, r, i);
            }
            computeStyle(n, r, i) {
              return i || "";
            }
            animate(n, r, i, o, s, a = [], l) {
              return new rs(i, o);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = P({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        nh = (() => {
          class e {}
          return (e.NOOP = new iC()), e;
        })();
      const U2 = 1e3,
        rh = "ng-enter",
        wl = "ng-leave",
        El = "ng-trigger",
        Cl = ".ng-trigger",
        sC = "ng-animating",
        ih = ".ng-animating";
      function Ln(e) {
        if ("number" == typeof e) return e;
        const t = e.match(/^(-?[\.\d]+)(m?s)/);
        return !t || t.length < 2 ? 0 : oh(parseFloat(t[1]), t[2]);
      }
      function oh(e, t) {
        return "s" === t ? e * U2 : e;
      }
      function bl(e, t, n) {
        return e.hasOwnProperty("duration")
          ? e
          : (function q2(e, t, n) {
              let i,
                o = 0,
                s = "";
              if ("string" == typeof e) {
                const a = e.match(/^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i);
                if (null === a) return t.push(XE()), { duration: 0, delay: 0, easing: "" };
                i = oh(parseFloat(a[1]), a[2]);
                const l = a[3];
                null != l && (o = oh(parseFloat(l), a[4]));
                const u = a[5];
                u && (s = u);
              } else i = e;
              if (!n) {
                let a = !1,
                  l = t.length;
                i < 0 &&
                  (t.push(
                    (function o2() {
                      return new D(3100, !1);
                    })()
                  ),
                  (a = !0)),
                  o < 0 &&
                    (t.push(
                      (function s2() {
                        return new D(3101, !1);
                      })()
                    ),
                    (a = !0)),
                  a && t.splice(l, 0, XE());
              }
              return { duration: i, delay: o, easing: s };
            })(e, t, n);
      }
      function is(e, t = {}) {
        return (
          Object.keys(e).forEach(n => {
            t[n] = e[n];
          }),
          t
        );
      }
      function aC(e) {
        const t = new Map();
        return (
          Object.keys(e).forEach(n => {
            t.set(n, e[n]);
          }),
          t
        );
      }
      function er(e, t = new Map(), n) {
        if (n) for (let [r, i] of n) t.set(r, i);
        for (let [r, i] of e) t.set(r, i);
        return t;
      }
      function gn(e, t, n) {
        t.forEach((r, i) => {
          const o = ah(i);
          n && !n.has(i) && n.set(i, e.style[o]), (e.style[o] = r);
        });
      }
      function Ir(e, t) {
        t.forEach((n, r) => {
          const i = ah(r);
          e.style[i] = "";
        });
      }
      function os(e) {
        return Array.isArray(e) ? (1 == e.length ? e[0] : KE(e)) : e;
      }
      const sh = new RegExp("{{\\s*(.+?)\\s*}}", "g");
      function uC(e) {
        let t = [];
        if ("string" == typeof e) {
          let n;
          for (; (n = sh.exec(e)); ) t.push(n[1]);
          sh.lastIndex = 0;
        }
        return t;
      }
      function ss(e, t, n) {
        const r = e.toString(),
          i = r.replace(sh, (o, s) => {
            let a = t[s];
            return (
              null == a &&
                (n.push(
                  (function l2(e) {
                    return new D(3003, !1);
                  })()
                ),
                (a = "")),
              a.toString()
            );
          });
        return i == r ? e : i;
      }
      function Sl(e) {
        const t = [];
        let n = e.next();
        for (; !n.done; ) t.push(n.value), (n = e.next());
        return t;
      }
      const K2 = /-+([a-z0-9])/g;
      function ah(e) {
        return e.replace(K2, (...t) => t[1].toUpperCase());
      }
      function Ct(e, t, n) {
        switch (t.type) {
          case 7:
            return e.visitTrigger(t, n);
          case 0:
            return e.visitState(t, n);
          case 1:
            return e.visitTransition(t, n);
          case 2:
            return e.visitSequence(t, n);
          case 3:
            return e.visitGroup(t, n);
          case 4:
            return e.visitAnimate(t, n);
          case 5:
            return e.visitKeyframes(t, n);
          case 6:
            return e.visitStyle(t, n);
          case 8:
            return e.visitReference(t, n);
          case 9:
            return e.visitAnimateChild(t, n);
          case 10:
            return e.visitAnimateRef(t, n);
          case 11:
            return e.visitQuery(t, n);
          case 12:
            return e.visitStagger(t, n);
          default:
            throw (function u2(e) {
              return new D(3004, !1);
            })();
        }
      }
      function cC(e, t) {
        return window.getComputedStyle(e)[t];
      }
      const Ml = "*";
      function Y2(e, t) {
        const n = [];
        return (
          "string" == typeof e
            ? e.split(/\s*,\s*/).forEach(r =>
                (function X2(e, t, n) {
                  if (":" == e[0]) {
                    const l = (function J2(e, t) {
                      switch (e) {
                        case ":enter":
                          return "void => *";
                        case ":leave":
                          return "* => void";
                        case ":increment":
                          return (n, r) => parseFloat(r) > parseFloat(n);
                        case ":decrement":
                          return (n, r) => parseFloat(r) < parseFloat(n);
                        default:
                          return (
                            t.push(
                              (function C2(e) {
                                return new D(3016, !1);
                              })()
                            ),
                            "* => *"
                          );
                      }
                    })(e, n);
                    if ("function" == typeof l) return void t.push(l);
                    e = l;
                  }
                  const r = e.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
                  if (null == r || r.length < 4)
                    return (
                      n.push(
                        (function E2(e) {
                          return new D(3015, !1);
                        })()
                      ),
                      t
                    );
                  const i = r[1],
                    o = r[2],
                    s = r[3];
                  t.push(dC(i, s));
                  "<" == o[0] && !(i == Ml && s == Ml) && t.push(dC(s, i));
                })(r, n, t)
              )
            : n.push(e),
          n
        );
      }
      const Tl = new Set(["true", "1"]),
        Il = new Set(["false", "0"]);
      function dC(e, t) {
        const n = Tl.has(e) || Il.has(e),
          r = Tl.has(t) || Il.has(t);
        return (i, o) => {
          let s = e == Ml || e == i,
            a = t == Ml || t == o;
          return (
            !s && n && "boolean" == typeof i && (s = i ? Tl.has(e) : Il.has(e)),
            !a && r && "boolean" == typeof o && (a = o ? Tl.has(t) : Il.has(t)),
            s && a
          );
        };
      }
      const ej = new RegExp("s*:selfs*,?", "g");
      function lh(e, t, n, r) {
        return new tj(e).build(t, n, r);
      }
      class tj {
        constructor(t) {
          this._driver = t;
        }
        build(t, n, r) {
          const i = new ij(n);
          return this._resetContextStyleTimingState(i), Ct(this, os(t), i);
        }
        _resetContextStyleTimingState(t) {
          (t.currentQuerySelector = ""),
            (t.collectedStyles = new Map()),
            t.collectedStyles.set("", new Map()),
            (t.currentTime = 0);
        }
        visitTrigger(t, n) {
          let r = (n.queryCount = 0),
            i = (n.depCount = 0);
          const o = [],
            s = [];
          return (
            "@" == t.name.charAt(0) &&
              n.errors.push(
                (function d2() {
                  return new D(3006, !1);
                })()
              ),
            t.definitions.forEach(a => {
              if ((this._resetContextStyleTimingState(n), 0 == a.type)) {
                const l = a,
                  u = l.name;
                u
                  .toString()
                  .split(/\s*,\s*/)
                  .forEach(c => {
                    (l.name = c), o.push(this.visitState(l, n));
                  }),
                  (l.name = u);
              } else if (1 == a.type) {
                const l = this.visitTransition(a, n);
                (r += l.queryCount), (i += l.depCount), s.push(l);
              } else
                n.errors.push(
                  (function f2() {
                    return new D(3007, !1);
                  })()
                );
            }),
            { type: 7, name: t.name, states: o, transitions: s, queryCount: r, depCount: i, options: null }
          );
        }
        visitState(t, n) {
          const r = this.visitStyle(t.styles, n),
            i = (t.options && t.options.params) || null;
          if (r.containsDynamicStyles) {
            const o = new Set(),
              s = i || {};
            r.styles.forEach(a => {
              a instanceof Map &&
                a.forEach(l => {
                  uC(l).forEach(u => {
                    s.hasOwnProperty(u) || o.add(u);
                  });
                });
            }),
              o.size &&
                (Sl(o.values()),
                n.errors.push(
                  (function h2(e, t) {
                    return new D(3008, !1);
                  })()
                ));
          }
          return { type: 0, name: t.name, style: r, options: i ? { params: i } : null };
        }
        visitTransition(t, n) {
          (n.queryCount = 0), (n.depCount = 0);
          const r = Ct(this, os(t.animation), n);
          return {
            type: 1,
            matchers: Y2(t.expr, n.errors),
            animation: r,
            queryCount: n.queryCount,
            depCount: n.depCount,
            options: Ar(t.options),
          };
        }
        visitSequence(t, n) {
          return { type: 2, steps: t.steps.map(r => Ct(this, r, n)), options: Ar(t.options) };
        }
        visitGroup(t, n) {
          const r = n.currentTime;
          let i = 0;
          const o = t.steps.map(s => {
            n.currentTime = r;
            const a = Ct(this, s, n);
            return (i = Math.max(i, n.currentTime)), a;
          });
          return (n.currentTime = i), { type: 3, steps: o, options: Ar(t.options) };
        }
        visitAnimate(t, n) {
          const r = (function sj(e, t) {
            if (e.hasOwnProperty("duration")) return e;
            if ("number" == typeof e) return uh(bl(e, t).duration, 0, "");
            const n = e;
            if (n.split(/\s+/).some(o => "{" == o.charAt(0) && "{" == o.charAt(1))) {
              const o = uh(0, 0, "");
              return (o.dynamic = !0), (o.strValue = n), o;
            }
            const i = bl(n, t);
            return uh(i.duration, i.delay, i.easing);
          })(t.timings, n.errors);
          n.currentAnimateTimings = r;
          let i,
            o = t.styles ? t.styles : QE({});
          if (5 == o.type) i = this.visitKeyframes(o, n);
          else {
            let s = t.styles,
              a = !1;
            if (!s) {
              a = !0;
              const u = {};
              r.easing && (u.easing = r.easing), (s = QE(u));
            }
            n.currentTime += r.duration + r.delay;
            const l = this.visitStyle(s, n);
            (l.isEmptyStep = a), (i = l);
          }
          return (n.currentAnimateTimings = null), { type: 4, timings: r, style: i, options: null };
        }
        visitStyle(t, n) {
          const r = this._makeStyleAst(t, n);
          return this._validateStyleAst(r, n), r;
        }
        _makeStyleAst(t, n) {
          const r = [],
            i = Array.isArray(t.styles) ? t.styles : [t.styles];
          for (let a of i)
            "string" == typeof a ? (a === kn ? r.push(a) : n.errors.push(new D(3002, !1))) : r.push(aC(a));
          let o = !1,
            s = null;
          return (
            r.forEach(a => {
              if (a instanceof Map && (a.has("easing") && ((s = a.get("easing")), a.delete("easing")), !o))
                for (let l of a.values())
                  if (l.toString().indexOf("{{") >= 0) {
                    o = !0;
                    break;
                  }
            }),
            { type: 6, styles: r, easing: s, offset: t.offset, containsDynamicStyles: o, options: null }
          );
        }
        _validateStyleAst(t, n) {
          const r = n.currentAnimateTimings;
          let i = n.currentTime,
            o = n.currentTime;
          r && o > 0 && (o -= r.duration + r.delay),
            t.styles.forEach(s => {
              "string" != typeof s &&
                s.forEach((a, l) => {
                  const u = n.collectedStyles.get(n.currentQuerySelector),
                    c = u.get(l);
                  let d = !0;
                  c &&
                    (o != i &&
                      o >= c.startTime &&
                      i <= c.endTime &&
                      (n.errors.push(
                        (function g2(e, t, n, r, i) {
                          return new D(3010, !1);
                        })()
                      ),
                      (d = !1)),
                    (o = c.startTime)),
                    d && u.set(l, { startTime: o, endTime: i }),
                    n.options &&
                      (function W2(e, t, n) {
                        const r = t.params || {},
                          i = uC(e);
                        i.length &&
                          i.forEach(o => {
                            r.hasOwnProperty(o) ||
                              n.push(
                                (function a2(e) {
                                  return new D(3001, !1);
                                })()
                              );
                          });
                      })(a, n.options, n.errors);
                });
            });
        }
        visitKeyframes(t, n) {
          const r = { type: 5, styles: [], options: null };
          if (!n.currentAnimateTimings)
            return (
              n.errors.push(
                (function m2() {
                  return new D(3011, !1);
                })()
              ),
              r
            );
          let o = 0;
          const s = [];
          let a = !1,
            l = !1,
            u = 0;
          const c = t.steps.map(v => {
            const m = this._makeStyleAst(v, n);
            let C =
                null != m.offset
                  ? m.offset
                  : (function oj(e) {
                      if ("string" == typeof e) return null;
                      let t = null;
                      if (Array.isArray(e))
                        e.forEach(n => {
                          if (n instanceof Map && n.has("offset")) {
                            const r = n;
                            (t = parseFloat(r.get("offset"))), r.delete("offset");
                          }
                        });
                      else if (e instanceof Map && e.has("offset")) {
                        const n = e;
                        (t = parseFloat(n.get("offset"))), n.delete("offset");
                      }
                      return t;
                    })(m.styles),
              T = 0;
            return (
              null != C && (o++, (T = m.offset = C)), (l = l || T < 0 || T > 1), (a = a || T < u), (u = T), s.push(T), m
            );
          });
          l &&
            n.errors.push(
              (function y2() {
                return new D(3012, !1);
              })()
            ),
            a &&
              n.errors.push(
                (function v2() {
                  return new D(3200, !1);
                })()
              );
          const d = t.steps.length;
          let f = 0;
          o > 0 && o < d
            ? n.errors.push(
                (function D2() {
                  return new D(3202, !1);
                })()
              )
            : 0 == o && (f = 1 / (d - 1));
          const h = d - 1,
            p = n.currentTime,
            g = n.currentAnimateTimings,
            y = g.duration;
          return (
            c.forEach((v, m) => {
              const C = f > 0 ? (m == h ? 1 : f * m) : s[m],
                T = C * y;
              (n.currentTime = p + g.delay + T),
                (g.duration = T),
                this._validateStyleAst(v, n),
                (v.offset = C),
                r.styles.push(v);
            }),
            r
          );
        }
        visitReference(t, n) {
          return { type: 8, animation: Ct(this, os(t.animation), n), options: Ar(t.options) };
        }
        visitAnimateChild(t, n) {
          return n.depCount++, { type: 9, options: Ar(t.options) };
        }
        visitAnimateRef(t, n) {
          return { type: 10, animation: this.visitReference(t.animation, n), options: Ar(t.options) };
        }
        visitQuery(t, n) {
          const r = n.currentQuerySelector,
            i = t.options || {};
          n.queryCount++, (n.currentQuery = t);
          const [o, s] = (function nj(e) {
            const t = !!e.split(/\s*,\s*/).find(n => ":self" == n);
            return (
              t && (e = e.replace(ej, "")),
              (e = e
                .replace(/@\*/g, Cl)
                .replace(/@\w+/g, n => Cl + "-" + n.slice(1))
                .replace(/:animating/g, ih)),
              [e, t]
            );
          })(t.selector);
          (n.currentQuerySelector = r.length ? r + " " + o : o),
            Et(n.collectedStyles, n.currentQuerySelector, new Map());
          const a = Ct(this, os(t.animation), n);
          return (
            (n.currentQuery = null),
            (n.currentQuerySelector = r),
            {
              type: 11,
              selector: o,
              limit: i.limit || 0,
              optional: !!i.optional,
              includeSelf: s,
              animation: a,
              originalSelector: t.selector,
              options: Ar(t.options),
            }
          );
        }
        visitStagger(t, n) {
          n.currentQuery ||
            n.errors.push(
              (function _2() {
                return new D(3013, !1);
              })()
            );
          const r = "full" === t.timings ? { duration: 0, delay: 0, easing: "full" } : bl(t.timings, n.errors, !0);
          return { type: 12, animation: Ct(this, os(t.animation), n), timings: r, options: null };
        }
      }
      class ij {
        constructor(t) {
          (this.errors = t),
            (this.queryCount = 0),
            (this.depCount = 0),
            (this.currentTransition = null),
            (this.currentQuery = null),
            (this.currentQuerySelector = null),
            (this.currentAnimateTimings = null),
            (this.currentTime = 0),
            (this.collectedStyles = new Map()),
            (this.options = null),
            (this.unsupportedCSSPropertiesFound = new Set());
        }
      }
      function Ar(e) {
        return (
          e
            ? (e = is(e)).params &&
              (e.params = (function rj(e) {
                return e ? is(e) : null;
              })(e.params))
            : (e = {}),
          e
        );
      }
      function uh(e, t, n) {
        return { duration: e, delay: t, easing: n };
      }
      function ch(e, t, n, r, i, o, s = null, a = !1) {
        return {
          type: 1,
          element: e,
          keyframes: t,
          preStyleProps: n,
          postStyleProps: r,
          duration: i,
          delay: o,
          totalTime: i + o,
          easing: s,
          subTimeline: a,
        };
      }
      class Al {
        constructor() {
          this._map = new Map();
        }
        get(t) {
          return this._map.get(t) || [];
        }
        append(t, n) {
          let r = this._map.get(t);
          r || this._map.set(t, (r = [])), r.push(...n);
        }
        has(t) {
          return this._map.has(t);
        }
        clear() {
          this._map.clear();
        }
      }
      const uj = new RegExp(":enter", "g"),
        dj = new RegExp(":leave", "g");
      function dh(e, t, n, r, i, o = new Map(), s = new Map(), a, l, u = []) {
        return new fj().buildKeyframes(e, t, n, r, i, o, s, a, l, u);
      }
      class fj {
        buildKeyframes(t, n, r, i, o, s, a, l, u, c = []) {
          u = u || new Al();
          const d = new fh(t, n, u, i, o, c, []);
          d.options = l;
          const f = l.delay ? Ln(l.delay) : 0;
          d.currentTimeline.delayNextStep(f), d.currentTimeline.setStyles([s], null, d.errors, l), Ct(this, r, d);
          const h = d.timelines.filter(p => p.containsAnimation());
          if (h.length && a.size) {
            let p;
            for (let g = h.length - 1; g >= 0; g--) {
              const y = h[g];
              if (y.element === n) {
                p = y;
                break;
              }
            }
            p && !p.allowOnlyTimelineStyles() && p.setStyles([a], null, d.errors, l);
          }
          return h.length ? h.map(p => p.buildKeyframes()) : [ch(n, [], [], [], 0, f, "", !1)];
        }
        visitTrigger(t, n) {}
        visitState(t, n) {}
        visitTransition(t, n) {}
        visitAnimateChild(t, n) {
          const r = n.subInstructions.get(n.element);
          if (r) {
            const i = n.createSubContext(t.options),
              o = n.currentTimeline.currentTime,
              s = this._visitSubInstructions(r, i, i.options);
            o != s && n.transformIntoNewTimeline(s);
          }
          n.previousNode = t;
        }
        visitAnimateRef(t, n) {
          const r = n.createSubContext(t.options);
          r.transformIntoNewTimeline(),
            this._applyAnimationRefDelays([t.options, t.animation.options], n, r),
            this.visitReference(t.animation, r),
            n.transformIntoNewTimeline(r.currentTimeline.currentTime),
            (n.previousNode = t);
        }
        _applyAnimationRefDelays(t, n, r) {
          for (const i of t) {
            const o = i?.delay;
            if (o) {
              const s = "number" == typeof o ? o : Ln(ss(o, i?.params ?? {}, n.errors));
              r.delayNextStep(s);
            }
          }
        }
        _visitSubInstructions(t, n, r) {
          let o = n.currentTimeline.currentTime;
          const s = null != r.duration ? Ln(r.duration) : null,
            a = null != r.delay ? Ln(r.delay) : null;
          return (
            0 !== s &&
              t.forEach(l => {
                const u = n.appendInstructionToTimeline(l, s, a);
                o = Math.max(o, u.duration + u.delay);
              }),
            o
          );
        }
        visitReference(t, n) {
          n.updateOptions(t.options, !0), Ct(this, t.animation, n), (n.previousNode = t);
        }
        visitSequence(t, n) {
          const r = n.subContextCount;
          let i = n;
          const o = t.options;
          if (
            o &&
            (o.params || o.delay) &&
            ((i = n.createSubContext(o)), i.transformIntoNewTimeline(), null != o.delay)
          ) {
            6 == i.previousNode.type && (i.currentTimeline.snapshotCurrentStyles(), (i.previousNode = Nl));
            const s = Ln(o.delay);
            i.delayNextStep(s);
          }
          t.steps.length &&
            (t.steps.forEach(s => Ct(this, s, i)),
            i.currentTimeline.applyStylesToKeyframe(),
            i.subContextCount > r && i.transformIntoNewTimeline()),
            (n.previousNode = t);
        }
        visitGroup(t, n) {
          const r = [];
          let i = n.currentTimeline.currentTime;
          const o = t.options && t.options.delay ? Ln(t.options.delay) : 0;
          t.steps.forEach(s => {
            const a = n.createSubContext(t.options);
            o && a.delayNextStep(o),
              Ct(this, s, a),
              (i = Math.max(i, a.currentTimeline.currentTime)),
              r.push(a.currentTimeline);
          }),
            r.forEach(s => n.currentTimeline.mergeTimelineCollectedStyles(s)),
            n.transformIntoNewTimeline(i),
            (n.previousNode = t);
        }
        _visitTiming(t, n) {
          if (t.dynamic) {
            const r = t.strValue;
            return bl(n.params ? ss(r, n.params, n.errors) : r, n.errors);
          }
          return { duration: t.duration, delay: t.delay, easing: t.easing };
        }
        visitAnimate(t, n) {
          const r = (n.currentAnimateTimings = this._visitTiming(t.timings, n)),
            i = n.currentTimeline;
          r.delay && (n.incrementTime(r.delay), i.snapshotCurrentStyles());
          const o = t.style;
          5 == o.type
            ? this.visitKeyframes(o, n)
            : (n.incrementTime(r.duration), this.visitStyle(o, n), i.applyStylesToKeyframe()),
            (n.currentAnimateTimings = null),
            (n.previousNode = t);
        }
        visitStyle(t, n) {
          const r = n.currentTimeline,
            i = n.currentAnimateTimings;
          !i && r.hasCurrentStyleProperties() && r.forwardFrame();
          const o = (i && i.easing) || t.easing;
          t.isEmptyStep ? r.applyEmptyStep(o) : r.setStyles(t.styles, o, n.errors, n.options), (n.previousNode = t);
        }
        visitKeyframes(t, n) {
          const r = n.currentAnimateTimings,
            i = n.currentTimeline.duration,
            o = r.duration,
            a = n.createSubContext().currentTimeline;
          (a.easing = r.easing),
            t.styles.forEach(l => {
              a.forwardTime((l.offset || 0) * o),
                a.setStyles(l.styles, l.easing, n.errors, n.options),
                a.applyStylesToKeyframe();
            }),
            n.currentTimeline.mergeTimelineCollectedStyles(a),
            n.transformIntoNewTimeline(i + o),
            (n.previousNode = t);
        }
        visitQuery(t, n) {
          const r = n.currentTimeline.currentTime,
            i = t.options || {},
            o = i.delay ? Ln(i.delay) : 0;
          o &&
            (6 === n.previousNode.type || (0 == r && n.currentTimeline.hasCurrentStyleProperties())) &&
            (n.currentTimeline.snapshotCurrentStyles(), (n.previousNode = Nl));
          let s = r;
          const a = n.invokeQuery(t.selector, t.originalSelector, t.limit, t.includeSelf, !!i.optional, n.errors);
          n.currentQueryTotal = a.length;
          let l = null;
          a.forEach((u, c) => {
            n.currentQueryIndex = c;
            const d = n.createSubContext(t.options, u);
            o && d.delayNextStep(o),
              u === n.element && (l = d.currentTimeline),
              Ct(this, t.animation, d),
              d.currentTimeline.applyStylesToKeyframe(),
              (s = Math.max(s, d.currentTimeline.currentTime));
          }),
            (n.currentQueryIndex = 0),
            (n.currentQueryTotal = 0),
            n.transformIntoNewTimeline(s),
            l && (n.currentTimeline.mergeTimelineCollectedStyles(l), n.currentTimeline.snapshotCurrentStyles()),
            (n.previousNode = t);
        }
        visitStagger(t, n) {
          const r = n.parentContext,
            i = n.currentTimeline,
            o = t.timings,
            s = Math.abs(o.duration),
            a = s * (n.currentQueryTotal - 1);
          let l = s * n.currentQueryIndex;
          switch (o.duration < 0 ? "reverse" : o.easing) {
            case "reverse":
              l = a - l;
              break;
            case "full":
              l = r.currentStaggerTime;
          }
          const c = n.currentTimeline;
          l && c.delayNextStep(l);
          const d = c.currentTime;
          Ct(this, t.animation, n),
            (n.previousNode = t),
            (r.currentStaggerTime = i.currentTime - d + (i.startTime - r.currentTimeline.startTime));
        }
      }
      const Nl = {};
      class fh {
        constructor(t, n, r, i, o, s, a, l) {
          (this._driver = t),
            (this.element = n),
            (this.subInstructions = r),
            (this._enterClassName = i),
            (this._leaveClassName = o),
            (this.errors = s),
            (this.timelines = a),
            (this.parentContext = null),
            (this.currentAnimateTimings = null),
            (this.previousNode = Nl),
            (this.subContextCount = 0),
            (this.options = {}),
            (this.currentQueryIndex = 0),
            (this.currentQueryTotal = 0),
            (this.currentStaggerTime = 0),
            (this.currentTimeline = l || new Rl(this._driver, n, 0)),
            a.push(this.currentTimeline);
        }
        get params() {
          return this.options.params;
        }
        updateOptions(t, n) {
          if (!t) return;
          const r = t;
          let i = this.options;
          null != r.duration && (i.duration = Ln(r.duration)), null != r.delay && (i.delay = Ln(r.delay));
          const o = r.params;
          if (o) {
            let s = i.params;
            s || (s = this.options.params = {}),
              Object.keys(o).forEach(a => {
                (!n || !s.hasOwnProperty(a)) && (s[a] = ss(o[a], s, this.errors));
              });
          }
        }
        _copyOptions() {
          const t = {};
          if (this.options) {
            const n = this.options.params;
            if (n) {
              const r = (t.params = {});
              Object.keys(n).forEach(i => {
                r[i] = n[i];
              });
            }
          }
          return t;
        }
        createSubContext(t = null, n, r) {
          const i = n || this.element,
            o = new fh(
              this._driver,
              i,
              this.subInstructions,
              this._enterClassName,
              this._leaveClassName,
              this.errors,
              this.timelines,
              this.currentTimeline.fork(i, r || 0)
            );
          return (
            (o.previousNode = this.previousNode),
            (o.currentAnimateTimings = this.currentAnimateTimings),
            (o.options = this._copyOptions()),
            o.updateOptions(t),
            (o.currentQueryIndex = this.currentQueryIndex),
            (o.currentQueryTotal = this.currentQueryTotal),
            (o.parentContext = this),
            this.subContextCount++,
            o
          );
        }
        transformIntoNewTimeline(t) {
          return (
            (this.previousNode = Nl),
            (this.currentTimeline = this.currentTimeline.fork(this.element, t)),
            this.timelines.push(this.currentTimeline),
            this.currentTimeline
          );
        }
        appendInstructionToTimeline(t, n, r) {
          const i = {
              duration: n ?? t.duration,
              delay: this.currentTimeline.currentTime + (r ?? 0) + t.delay,
              easing: "",
            },
            o = new hj(
              this._driver,
              t.element,
              t.keyframes,
              t.preStyleProps,
              t.postStyleProps,
              i,
              t.stretchStartingKeyframe
            );
          return this.timelines.push(o), i;
        }
        incrementTime(t) {
          this.currentTimeline.forwardTime(this.currentTimeline.duration + t);
        }
        delayNextStep(t) {
          t > 0 && this.currentTimeline.delayNextStep(t);
        }
        invokeQuery(t, n, r, i, o, s) {
          let a = [];
          if ((i && a.push(this.element), t.length > 0)) {
            t = (t = t.replace(uj, "." + this._enterClassName)).replace(dj, "." + this._leaveClassName);
            let u = this._driver.query(this.element, t, 1 != r);
            0 !== r && (u = r < 0 ? u.slice(u.length + r, u.length) : u.slice(0, r)), a.push(...u);
          }
          return (
            !o &&
              0 == a.length &&
              s.push(
                (function w2(e) {
                  return new D(3014, !1);
                })()
              ),
            a
          );
        }
      }
      class Rl {
        constructor(t, n, r, i) {
          (this._driver = t),
            (this.element = n),
            (this.startTime = r),
            (this._elementTimelineStylesLookup = i),
            (this.duration = 0),
            (this.easing = null),
            (this._previousKeyframe = new Map()),
            (this._currentKeyframe = new Map()),
            (this._keyframes = new Map()),
            (this._styleSummary = new Map()),
            (this._localTimelineStyles = new Map()),
            (this._pendingStyles = new Map()),
            (this._backFill = new Map()),
            (this._currentEmptyStepKeyframe = null),
            this._elementTimelineStylesLookup || (this._elementTimelineStylesLookup = new Map()),
            (this._globalTimelineStyles = this._elementTimelineStylesLookup.get(n)),
            this._globalTimelineStyles ||
              ((this._globalTimelineStyles = this._localTimelineStyles),
              this._elementTimelineStylesLookup.set(n, this._localTimelineStyles)),
            this._loadKeyframe();
        }
        containsAnimation() {
          switch (this._keyframes.size) {
            case 0:
              return !1;
            case 1:
              return this.hasCurrentStyleProperties();
            default:
              return !0;
          }
        }
        hasCurrentStyleProperties() {
          return this._currentKeyframe.size > 0;
        }
        get currentTime() {
          return this.startTime + this.duration;
        }
        delayNextStep(t) {
          const n = 1 === this._keyframes.size && this._pendingStyles.size;
          this.duration || n
            ? (this.forwardTime(this.currentTime + t), n && this.snapshotCurrentStyles())
            : (this.startTime += t);
        }
        fork(t, n) {
          return (
            this.applyStylesToKeyframe(),
            new Rl(this._driver, t, n || this.currentTime, this._elementTimelineStylesLookup)
          );
        }
        _loadKeyframe() {
          this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe),
            (this._currentKeyframe = this._keyframes.get(this.duration)),
            this._currentKeyframe ||
              ((this._currentKeyframe = new Map()), this._keyframes.set(this.duration, this._currentKeyframe));
        }
        forwardFrame() {
          (this.duration += 1), this._loadKeyframe();
        }
        forwardTime(t) {
          this.applyStylesToKeyframe(), (this.duration = t), this._loadKeyframe();
        }
        _updateStyle(t, n) {
          this._localTimelineStyles.set(t, n),
            this._globalTimelineStyles.set(t, n),
            this._styleSummary.set(t, { time: this.currentTime, value: n });
        }
        allowOnlyTimelineStyles() {
          return this._currentEmptyStepKeyframe !== this._currentKeyframe;
        }
        applyEmptyStep(t) {
          t && this._previousKeyframe.set("easing", t);
          for (let [n, r] of this._globalTimelineStyles)
            this._backFill.set(n, r || kn), this._currentKeyframe.set(n, kn);
          this._currentEmptyStepKeyframe = this._currentKeyframe;
        }
        setStyles(t, n, r, i) {
          n && this._previousKeyframe.set("easing", n);
          const o = (i && i.params) || {},
            s = (function pj(e, t) {
              const n = new Map();
              let r;
              return (
                e.forEach(i => {
                  if ("*" === i) {
                    r = r || t.keys();
                    for (let o of r) n.set(o, kn);
                  } else er(i, n);
                }),
                n
              );
            })(t, this._globalTimelineStyles);
          for (let [a, l] of s) {
            const u = ss(l, o, r);
            this._pendingStyles.set(a, u),
              this._localTimelineStyles.has(a) || this._backFill.set(a, this._globalTimelineStyles.get(a) ?? kn),
              this._updateStyle(a, u);
          }
        }
        applyStylesToKeyframe() {
          0 != this._pendingStyles.size &&
            (this._pendingStyles.forEach((t, n) => {
              this._currentKeyframe.set(n, t);
            }),
            this._pendingStyles.clear(),
            this._localTimelineStyles.forEach((t, n) => {
              this._currentKeyframe.has(n) || this._currentKeyframe.set(n, t);
            }));
        }
        snapshotCurrentStyles() {
          for (let [t, n] of this._localTimelineStyles) this._pendingStyles.set(t, n), this._updateStyle(t, n);
        }
        getFinalKeyframe() {
          return this._keyframes.get(this.duration);
        }
        get properties() {
          const t = [];
          for (let n in this._currentKeyframe) t.push(n);
          return t;
        }
        mergeTimelineCollectedStyles(t) {
          t._styleSummary.forEach((n, r) => {
            const i = this._styleSummary.get(r);
            (!i || n.time > i.time) && this._updateStyle(r, n.value);
          });
        }
        buildKeyframes() {
          this.applyStylesToKeyframe();
          const t = new Set(),
            n = new Set(),
            r = 1 === this._keyframes.size && 0 === this.duration;
          let i = [];
          this._keyframes.forEach((a, l) => {
            const u = er(a, new Map(), this._backFill);
            u.forEach((c, d) => {
              c === Yf ? t.add(d) : c === kn && n.add(d);
            }),
              r || u.set("offset", l / this.duration),
              i.push(u);
          });
          const o = t.size ? Sl(t.values()) : [],
            s = n.size ? Sl(n.values()) : [];
          if (r) {
            const a = i[0],
              l = new Map(a);
            a.set("offset", 0), l.set("offset", 1), (i = [a, l]);
          }
          return ch(this.element, i, o, s, this.duration, this.startTime, this.easing, !1);
        }
      }
      class hj extends Rl {
        constructor(t, n, r, i, o, s, a = !1) {
          super(t, n, s.delay),
            (this.keyframes = r),
            (this.preStyleProps = i),
            (this.postStyleProps = o),
            (this._stretchStartingKeyframe = a),
            (this.timings = { duration: s.duration, delay: s.delay, easing: s.easing });
        }
        containsAnimation() {
          return this.keyframes.length > 1;
        }
        buildKeyframes() {
          let t = this.keyframes,
            { delay: n, duration: r, easing: i } = this.timings;
          if (this._stretchStartingKeyframe && n) {
            const o = [],
              s = r + n,
              a = n / s,
              l = er(t[0]);
            l.set("offset", 0), o.push(l);
            const u = er(t[0]);
            u.set("offset", pC(a)), o.push(u);
            const c = t.length - 1;
            for (let d = 1; d <= c; d++) {
              let f = er(t[d]);
              const h = f.get("offset");
              f.set("offset", pC((n + h * r) / s)), o.push(f);
            }
            (r = s), (n = 0), (i = ""), (t = o);
          }
          return ch(this.element, t, this.preStyleProps, this.postStyleProps, r, n, i, !0);
        }
      }
      function pC(e, t = 3) {
        const n = Math.pow(10, t - 1);
        return Math.round(e * n) / n;
      }
      class hh {}
      const gj = new Set([
        "width",
        "height",
        "minWidth",
        "minHeight",
        "maxWidth",
        "maxHeight",
        "left",
        "top",
        "bottom",
        "right",
        "fontSize",
        "outlineWidth",
        "outlineOffset",
        "paddingTop",
        "paddingLeft",
        "paddingBottom",
        "paddingRight",
        "marginTop",
        "marginLeft",
        "marginBottom",
        "marginRight",
        "borderRadius",
        "borderWidth",
        "borderTopWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "textIndent",
        "perspective",
      ]);
      class mj extends hh {
        normalizePropertyName(t, n) {
          return ah(t);
        }
        normalizeStyleValue(t, n, r, i) {
          let o = "";
          const s = r.toString().trim();
          if (gj.has(n) && 0 !== r && "0" !== r)
            if ("number" == typeof r) o = "px";
            else {
              const a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
              a &&
                0 == a[1].length &&
                i.push(
                  (function c2(e, t) {
                    return new D(3005, !1);
                  })()
                );
            }
          return s + o;
        }
      }
      function gC(e, t, n, r, i, o, s, a, l, u, c, d, f) {
        return {
          type: 0,
          element: e,
          triggerName: t,
          isRemovalTransition: i,
          fromState: n,
          fromStyles: o,
          toState: r,
          toStyles: s,
          timelines: a,
          queriedElements: l,
          preStyleProps: u,
          postStyleProps: c,
          totalTime: d,
          errors: f,
        };
      }
      const ph = {};
      class mC {
        constructor(t, n, r) {
          (this._triggerName = t), (this.ast = n), (this._stateStyles = r);
        }
        match(t, n, r, i) {
          return (function yj(e, t, n, r, i) {
            return e.some(o => o(t, n, r, i));
          })(this.ast.matchers, t, n, r, i);
        }
        buildStyles(t, n, r) {
          let i = this._stateStyles.get("*");
          return void 0 !== t && (i = this._stateStyles.get(t?.toString()) || i), i ? i.buildStyles(n, r) : new Map();
        }
        build(t, n, r, i, o, s, a, l, u, c) {
          const d = [],
            f = (this.ast.options && this.ast.options.params) || ph,
            p = this.buildStyles(r, (a && a.params) || ph, d),
            g = (l && l.params) || ph,
            y = this.buildStyles(i, g, d),
            v = new Set(),
            m = new Map(),
            C = new Map(),
            T = "void" === i,
            x = { params: vj(g, f), delay: this.ast.options?.delay },
            de = c ? [] : dh(t, n, this.ast.animation, o, s, p, y, x, u, d);
          let Ie = 0;
          if (
            (de.forEach(jn => {
              Ie = Math.max(jn.duration + jn.delay, Ie);
            }),
            d.length)
          )
            return gC(n, this._triggerName, r, i, T, p, y, [], [], m, C, Ie, d);
          de.forEach(jn => {
            const Bn = jn.element,
              RC = Et(m, Bn, new Set());
            jn.preStyleProps.forEach(Nr => RC.add(Nr));
            const ls = Et(C, Bn, new Set());
            jn.postStyleProps.forEach(Nr => ls.add(Nr)), Bn !== n && v.add(Bn);
          });
          const Zt = Sl(v.values());
          return gC(n, this._triggerName, r, i, T, p, y, de, Zt, m, C, Ie);
        }
      }
      function vj(e, t) {
        const n = is(t);
        for (const r in e) e.hasOwnProperty(r) && null != e[r] && (n[r] = e[r]);
        return n;
      }
      class Dj {
        constructor(t, n, r) {
          (this.styles = t), (this.defaultParams = n), (this.normalizer = r);
        }
        buildStyles(t, n) {
          const r = new Map(),
            i = is(this.defaultParams);
          return (
            Object.keys(t).forEach(o => {
              const s = t[o];
              null !== s && (i[o] = s);
            }),
            this.styles.styles.forEach(o => {
              "string" != typeof o &&
                o.forEach((s, a) => {
                  s && (s = ss(s, i, n));
                  const l = this.normalizer.normalizePropertyName(a, n);
                  (s = this.normalizer.normalizeStyleValue(a, l, s, n)), r.set(a, s);
                });
            }),
            r
          );
        }
      }
      class wj {
        constructor(t, n, r) {
          (this.name = t),
            (this.ast = n),
            (this._normalizer = r),
            (this.transitionFactories = []),
            (this.states = new Map()),
            n.states.forEach(i => {
              this.states.set(i.name, new Dj(i.style, (i.options && i.options.params) || {}, r));
            }),
            yC(this.states, "true", "1"),
            yC(this.states, "false", "0"),
            n.transitions.forEach(i => {
              this.transitionFactories.push(new mC(t, i, this.states));
            }),
            (this.fallbackTransition = (function Ej(e, t, n) {
              return new mC(
                e,
                {
                  type: 1,
                  animation: { type: 2, steps: [], options: null },
                  matchers: [(s, a) => !0],
                  options: null,
                  queryCount: 0,
                  depCount: 0,
                },
                t
              );
            })(t, this.states));
        }
        get containsQueries() {
          return this.ast.queryCount > 0;
        }
        matchTransition(t, n, r, i) {
          return this.transitionFactories.find(s => s.match(t, n, r, i)) || null;
        }
        matchStyles(t, n, r) {
          return this.fallbackTransition.buildStyles(t, n, r);
        }
      }
      function yC(e, t, n) {
        e.has(t) ? e.has(n) || e.set(n, e.get(t)) : e.has(n) && e.set(t, e.get(n));
      }
      const Cj = new Al();
      class bj {
        constructor(t, n, r) {
          (this.bodyNode = t),
            (this._driver = n),
            (this._normalizer = r),
            (this._animations = new Map()),
            (this._playersById = new Map()),
            (this.players = []);
        }
        register(t, n) {
          const r = [],
            o = lh(this._driver, n, r, []);
          if (r.length)
            throw (function I2(e) {
              return new D(3503, !1);
            })();
          this._animations.set(t, o);
        }
        _buildPlayer(t, n, r) {
          const i = t.element,
            o = JE(this._normalizer, t.keyframes, n, r);
          return this._driver.animate(i, o, t.duration, t.delay, t.easing, [], !0);
        }
        create(t, n, r = {}) {
          const i = [],
            o = this._animations.get(t);
          let s;
          const a = new Map();
          if (
            (o
              ? ((s = dh(this._driver, n, o, rh, wl, new Map(), new Map(), r, Cj, i)),
                s.forEach(c => {
                  const d = Et(a, c.element, new Map());
                  c.postStyleProps.forEach(f => d.set(f, null));
                }))
              : (i.push(
                  (function A2() {
                    return new D(3300, !1);
                  })()
                ),
                (s = [])),
            i.length)
          )
            throw (function N2(e) {
              return new D(3504, !1);
            })();
          a.forEach((c, d) => {
            c.forEach((f, h) => {
              c.set(h, this._driver.computeStyle(d, h, kn));
            });
          });
          const u = Jn(
            s.map(c => {
              const d = a.get(c.element);
              return this._buildPlayer(c, new Map(), d);
            })
          );
          return this._playersById.set(t, u), u.onDestroy(() => this.destroy(t)), this.players.push(u), u;
        }
        destroy(t) {
          const n = this._getPlayer(t);
          n.destroy(), this._playersById.delete(t);
          const r = this.players.indexOf(n);
          r >= 0 && this.players.splice(r, 1);
        }
        _getPlayer(t) {
          const n = this._playersById.get(t);
          if (!n)
            throw (function R2(e) {
              return new D(3301, !1);
            })();
          return n;
        }
        listen(t, n, r, i) {
          const o = eh(n, "", "", "");
          return Xf(this._getPlayer(t), r, o, i), () => {};
        }
        command(t, n, r, i) {
          if ("register" == r) return void this.register(t, i[0]);
          if ("create" == r) return void this.create(t, n, i[0] || {});
          const o = this._getPlayer(t);
          switch (r) {
            case "play":
              o.play();
              break;
            case "pause":
              o.pause();
              break;
            case "reset":
              o.reset();
              break;
            case "restart":
              o.restart();
              break;
            case "finish":
              o.finish();
              break;
            case "init":
              o.init();
              break;
            case "setPosition":
              o.setPosition(parseFloat(i[0]));
              break;
            case "destroy":
              this.destroy(t);
          }
        }
      }
      const vC = "ng-animate-queued",
        gh = "ng-animate-disabled",
        Aj = [],
        DC = { namespaceId: "", setForRemoval: !1, setForMove: !1, hasAnimation: !1, removedBeforeQueried: !1 },
        Nj = { namespaceId: "", setForMove: !1, setForRemoval: !1, hasAnimation: !1, removedBeforeQueried: !0 },
        Ot = "__ng_removed";
      class mh {
        get params() {
          return this.options.params;
        }
        constructor(t, n = "") {
          this.namespaceId = n;
          const r = t && t.hasOwnProperty("value");
          if (
            ((this.value = (function Oj(e) {
              return e ?? null;
            })(r ? t.value : t)),
            r)
          ) {
            const o = is(t);
            delete o.value, (this.options = o);
          } else this.options = {};
          this.options.params || (this.options.params = {});
        }
        absorbOptions(t) {
          const n = t.params;
          if (n) {
            const r = this.options.params;
            Object.keys(n).forEach(i => {
              null == r[i] && (r[i] = n[i]);
            });
          }
        }
      }
      const as = "void",
        yh = new mh(as);
      class Rj {
        constructor(t, n, r) {
          (this.id = t),
            (this.hostElement = n),
            (this._engine = r),
            (this.players = []),
            (this._triggers = new Map()),
            (this._queue = []),
            (this._elementListeners = new Map()),
            (this._hostClassName = "ng-tns-" + t),
            Ft(n, this._hostClassName);
        }
        listen(t, n, r, i) {
          if (!this._triggers.has(n))
            throw (function P2(e, t) {
              return new D(3302, !1);
            })();
          if (null == r || 0 == r.length)
            throw (function x2(e) {
              return new D(3303, !1);
            })();
          if (
            !(function Fj(e) {
              return "start" == e || "done" == e;
            })(r)
          )
            throw (function O2(e, t) {
              return new D(3400, !1);
            })();
          const o = Et(this._elementListeners, t, []),
            s = { name: n, phase: r, callback: i };
          o.push(s);
          const a = Et(this._engine.statesByElement, t, new Map());
          return (
            a.has(n) || (Ft(t, El), Ft(t, El + "-" + n), a.set(n, yh)),
            () => {
              this._engine.afterFlush(() => {
                const l = o.indexOf(s);
                l >= 0 && o.splice(l, 1), this._triggers.has(n) || a.delete(n);
              });
            }
          );
        }
        register(t, n) {
          return !this._triggers.has(t) && (this._triggers.set(t, n), !0);
        }
        _getTrigger(t) {
          const n = this._triggers.get(t);
          if (!n)
            throw (function F2(e) {
              return new D(3401, !1);
            })();
          return n;
        }
        trigger(t, n, r, i = !0) {
          const o = this._getTrigger(n),
            s = new vh(this.id, n, t);
          let a = this._engine.statesByElement.get(t);
          a || (Ft(t, El), Ft(t, El + "-" + n), this._engine.statesByElement.set(t, (a = new Map())));
          let l = a.get(n);
          const u = new mh(r, this.id);
          if (
            (!(r && r.hasOwnProperty("value")) && l && u.absorbOptions(l.options),
            a.set(n, u),
            l || (l = yh),
            u.value !== as && l.value === u.value)
          ) {
            if (
              !(function jj(e, t) {
                const n = Object.keys(e),
                  r = Object.keys(t);
                if (n.length != r.length) return !1;
                for (let i = 0; i < n.length; i++) {
                  const o = n[i];
                  if (!t.hasOwnProperty(o) || e[o] !== t[o]) return !1;
                }
                return !0;
              })(l.params, u.params)
            ) {
              const g = [],
                y = o.matchStyles(l.value, l.params, g),
                v = o.matchStyles(u.value, u.params, g);
              g.length
                ? this._engine.reportError(g)
                : this._engine.afterFlush(() => {
                    Ir(t, y), gn(t, v);
                  });
            }
            return;
          }
          const f = Et(this._engine.playersByElement, t, []);
          f.forEach(g => {
            g.namespaceId == this.id && g.triggerName == n && g.queued && g.destroy();
          });
          let h = o.matchTransition(l.value, u.value, t, u.params),
            p = !1;
          if (!h) {
            if (!i) return;
            (h = o.fallbackTransition), (p = !0);
          }
          return (
            this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: t,
              triggerName: n,
              transition: h,
              fromState: l,
              toState: u,
              player: s,
              isFallbackTransition: p,
            }),
            p ||
              (Ft(t, vC),
              s.onStart(() => {
                xi(t, vC);
              })),
            s.onDone(() => {
              let g = this.players.indexOf(s);
              g >= 0 && this.players.splice(g, 1);
              const y = this._engine.playersByElement.get(t);
              if (y) {
                let v = y.indexOf(s);
                v >= 0 && y.splice(v, 1);
              }
            }),
            this.players.push(s),
            f.push(s),
            s
          );
        }
        deregister(t) {
          this._triggers.delete(t),
            this._engine.statesByElement.forEach(n => n.delete(t)),
            this._elementListeners.forEach((n, r) => {
              this._elementListeners.set(
                r,
                n.filter(i => i.name != t)
              );
            });
        }
        clearElementCache(t) {
          this._engine.statesByElement.delete(t), this._elementListeners.delete(t);
          const n = this._engine.playersByElement.get(t);
          n && (n.forEach(r => r.destroy()), this._engine.playersByElement.delete(t));
        }
        _signalRemovalForInnerTriggers(t, n) {
          const r = this._engine.driver.query(t, Cl, !0);
          r.forEach(i => {
            if (i[Ot]) return;
            const o = this._engine.fetchNamespacesByElement(i);
            o.size ? o.forEach(s => s.triggerLeaveAnimation(i, n, !1, !0)) : this.clearElementCache(i);
          }),
            this._engine.afterFlushAnimationsDone(() => r.forEach(i => this.clearElementCache(i)));
        }
        triggerLeaveAnimation(t, n, r, i) {
          const o = this._engine.statesByElement.get(t),
            s = new Map();
          if (o) {
            const a = [];
            if (
              (o.forEach((l, u) => {
                if ((s.set(u, l.value), this._triggers.has(u))) {
                  const c = this.trigger(t, u, as, i);
                  c && a.push(c);
                }
              }),
              a.length)
            )
              return (
                this._engine.markElementAsRemoved(this.id, t, !0, n, s),
                r && Jn(a).onDone(() => this._engine.processLeaveNode(t)),
                !0
              );
          }
          return !1;
        }
        prepareLeaveAnimationListeners(t) {
          const n = this._elementListeners.get(t),
            r = this._engine.statesByElement.get(t);
          if (n && r) {
            const i = new Set();
            n.forEach(o => {
              const s = o.name;
              if (i.has(s)) return;
              i.add(s);
              const l = this._triggers.get(s).fallbackTransition,
                u = r.get(s) || yh,
                c = new mh(as),
                d = new vh(this.id, s, t);
              this._engine.totalQueuedPlayers++,
                this._queue.push({
                  element: t,
                  triggerName: s,
                  transition: l,
                  fromState: u,
                  toState: c,
                  player: d,
                  isFallbackTransition: !0,
                });
            });
          }
        }
        removeNode(t, n) {
          const r = this._engine;
          if ((t.childElementCount && this._signalRemovalForInnerTriggers(t, n), this.triggerLeaveAnimation(t, n, !0)))
            return;
          let i = !1;
          if (r.totalAnimations) {
            const o = r.players.length ? r.playersByQueriedElement.get(t) : [];
            if (o && o.length) i = !0;
            else {
              let s = t;
              for (; (s = s.parentNode); )
                if (r.statesByElement.get(s)) {
                  i = !0;
                  break;
                }
            }
          }
          if ((this.prepareLeaveAnimationListeners(t), i)) r.markElementAsRemoved(this.id, t, !1, n);
          else {
            const o = t[Ot];
            (!o || o === DC) &&
              (r.afterFlush(() => this.clearElementCache(t)), r.destroyInnerAnimations(t), r._onRemovalComplete(t, n));
          }
        }
        insertNode(t, n) {
          Ft(t, this._hostClassName);
        }
        drainQueuedTransitions(t) {
          const n = [];
          return (
            this._queue.forEach(r => {
              const i = r.player;
              if (i.destroyed) return;
              const o = r.element,
                s = this._elementListeners.get(o);
              s &&
                s.forEach(a => {
                  if (a.name == r.triggerName) {
                    const l = eh(o, r.triggerName, r.fromState.value, r.toState.value);
                    (l._data = t), Xf(r.player, a.phase, l, a.callback);
                  }
                }),
                i.markedForDestroy
                  ? this._engine.afterFlush(() => {
                      i.destroy();
                    })
                  : n.push(r);
            }),
            (this._queue = []),
            n.sort((r, i) => {
              const o = r.transition.ast.depCount,
                s = i.transition.ast.depCount;
              return 0 == o || 0 == s ? o - s : this._engine.driver.containsElement(r.element, i.element) ? 1 : -1;
            })
          );
        }
        destroy(t) {
          this.players.forEach(n => n.destroy()), this._signalRemovalForInnerTriggers(this.hostElement, t);
        }
        elementContainsData(t) {
          let n = !1;
          return this._elementListeners.has(t) && (n = !0), (n = !!this._queue.find(r => r.element === t) || n), n;
        }
      }
      class Pj {
        _onRemovalComplete(t, n) {
          this.onRemovalComplete(t, n);
        }
        constructor(t, n, r) {
          (this.bodyNode = t),
            (this.driver = n),
            (this._normalizer = r),
            (this.players = []),
            (this.newHostElements = new Map()),
            (this.playersByElement = new Map()),
            (this.playersByQueriedElement = new Map()),
            (this.statesByElement = new Map()),
            (this.disabledNodes = new Set()),
            (this.totalAnimations = 0),
            (this.totalQueuedPlayers = 0),
            (this._namespaceLookup = {}),
            (this._namespaceList = []),
            (this._flushFns = []),
            (this._whenQuietFns = []),
            (this.namespacesByHostElement = new Map()),
            (this.collectedEnterElements = []),
            (this.collectedLeaveElements = []),
            (this.onRemovalComplete = (i, o) => {});
        }
        get queuedPlayers() {
          const t = [];
          return (
            this._namespaceList.forEach(n => {
              n.players.forEach(r => {
                r.queued && t.push(r);
              });
            }),
            t
          );
        }
        createNamespace(t, n) {
          const r = new Rj(t, n, this);
          return (
            this.bodyNode && this.driver.containsElement(this.bodyNode, n)
              ? this._balanceNamespaceList(r, n)
              : (this.newHostElements.set(n, r), this.collectEnterElement(n)),
            (this._namespaceLookup[t] = r)
          );
        }
        _balanceNamespaceList(t, n) {
          const r = this._namespaceList,
            i = this.namespacesByHostElement;
          if (r.length - 1 >= 0) {
            let s = !1,
              a = this.driver.getParentElement(n);
            for (; a; ) {
              const l = i.get(a);
              if (l) {
                const u = r.indexOf(l);
                r.splice(u + 1, 0, t), (s = !0);
                break;
              }
              a = this.driver.getParentElement(a);
            }
            s || r.unshift(t);
          } else r.push(t);
          return i.set(n, t), t;
        }
        register(t, n) {
          let r = this._namespaceLookup[t];
          return r || (r = this.createNamespace(t, n)), r;
        }
        registerTrigger(t, n, r) {
          let i = this._namespaceLookup[t];
          i && i.register(n, r) && this.totalAnimations++;
        }
        destroy(t, n) {
          if (!t) return;
          const r = this._fetchNamespace(t);
          this.afterFlush(() => {
            this.namespacesByHostElement.delete(r.hostElement), delete this._namespaceLookup[t];
            const i = this._namespaceList.indexOf(r);
            i >= 0 && this._namespaceList.splice(i, 1);
          }),
            this.afterFlushAnimationsDone(() => r.destroy(n));
        }
        _fetchNamespace(t) {
          return this._namespaceLookup[t];
        }
        fetchNamespacesByElement(t) {
          const n = new Set(),
            r = this.statesByElement.get(t);
          if (r)
            for (let i of r.values())
              if (i.namespaceId) {
                const o = this._fetchNamespace(i.namespaceId);
                o && n.add(o);
              }
          return n;
        }
        trigger(t, n, r, i) {
          if (Pl(n)) {
            const o = this._fetchNamespace(t);
            if (o) return o.trigger(n, r, i), !0;
          }
          return !1;
        }
        insertNode(t, n, r, i) {
          if (!Pl(n)) return;
          const o = n[Ot];
          if (o && o.setForRemoval) {
            (o.setForRemoval = !1), (o.setForMove = !0);
            const s = this.collectedLeaveElements.indexOf(n);
            s >= 0 && this.collectedLeaveElements.splice(s, 1);
          }
          if (t) {
            const s = this._fetchNamespace(t);
            s && s.insertNode(n, r);
          }
          i && this.collectEnterElement(n);
        }
        collectEnterElement(t) {
          this.collectedEnterElements.push(t);
        }
        markElementAsDisabled(t, n) {
          n
            ? this.disabledNodes.has(t) || (this.disabledNodes.add(t), Ft(t, gh))
            : this.disabledNodes.has(t) && (this.disabledNodes.delete(t), xi(t, gh));
        }
        removeNode(t, n, r, i) {
          if (Pl(n)) {
            const o = t ? this._fetchNamespace(t) : null;
            if ((o ? o.removeNode(n, i) : this.markElementAsRemoved(t, n, !1, i), r)) {
              const s = this.namespacesByHostElement.get(n);
              s && s.id !== t && s.removeNode(n, i);
            }
          } else this._onRemovalComplete(n, i);
        }
        markElementAsRemoved(t, n, r, i, o) {
          this.collectedLeaveElements.push(n),
            (n[Ot] = {
              namespaceId: t,
              setForRemoval: i,
              hasAnimation: r,
              removedBeforeQueried: !1,
              previousTriggersValues: o,
            });
        }
        listen(t, n, r, i, o) {
          return Pl(n) ? this._fetchNamespace(t).listen(n, r, i, o) : () => {};
        }
        _buildInstruction(t, n, r, i, o) {
          return t.transition.build(
            this.driver,
            t.element,
            t.fromState.value,
            t.toState.value,
            r,
            i,
            t.fromState.options,
            t.toState.options,
            n,
            o
          );
        }
        destroyInnerAnimations(t) {
          let n = this.driver.query(t, Cl, !0);
          n.forEach(r => this.destroyActiveAnimationsForElement(r)),
            0 != this.playersByQueriedElement.size &&
              ((n = this.driver.query(t, ih, !0)), n.forEach(r => this.finishActiveQueriedAnimationOnElement(r)));
        }
        destroyActiveAnimationsForElement(t) {
          const n = this.playersByElement.get(t);
          n &&
            n.forEach(r => {
              r.queued ? (r.markedForDestroy = !0) : r.destroy();
            });
        }
        finishActiveQueriedAnimationOnElement(t) {
          const n = this.playersByQueriedElement.get(t);
          n && n.forEach(r => r.finish());
        }
        whenRenderingDone() {
          return new Promise(t => {
            if (this.players.length) return Jn(this.players).onDone(() => t());
            t();
          });
        }
        processLeaveNode(t) {
          const n = t[Ot];
          if (n && n.setForRemoval) {
            if (((t[Ot] = DC), n.namespaceId)) {
              this.destroyInnerAnimations(t);
              const r = this._fetchNamespace(n.namespaceId);
              r && r.clearElementCache(t);
            }
            this._onRemovalComplete(t, n.setForRemoval);
          }
          t.classList?.contains(gh) && this.markElementAsDisabled(t, !1),
            this.driver.query(t, ".ng-animate-disabled", !0).forEach(r => {
              this.markElementAsDisabled(r, !1);
            });
        }
        flush(t = -1) {
          let n = [];
          if (
            (this.newHostElements.size &&
              (this.newHostElements.forEach((r, i) => this._balanceNamespaceList(r, i)), this.newHostElements.clear()),
            this.totalAnimations && this.collectedEnterElements.length)
          )
            for (let r = 0; r < this.collectedEnterElements.length; r++)
              Ft(this.collectedEnterElements[r], "ng-star-inserted");
          if (this._namespaceList.length && (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
            const r = [];
            try {
              n = this._flushAnimations(r, t);
            } finally {
              for (let i = 0; i < r.length; i++) r[i]();
            }
          } else
            for (let r = 0; r < this.collectedLeaveElements.length; r++)
              this.processLeaveNode(this.collectedLeaveElements[r]);
          if (
            ((this.totalQueuedPlayers = 0),
            (this.collectedEnterElements.length = 0),
            (this.collectedLeaveElements.length = 0),
            this._flushFns.forEach(r => r()),
            (this._flushFns = []),
            this._whenQuietFns.length)
          ) {
            const r = this._whenQuietFns;
            (this._whenQuietFns = []),
              n.length
                ? Jn(n).onDone(() => {
                    r.forEach(i => i());
                  })
                : r.forEach(i => i());
          }
        }
        reportError(t) {
          throw (function k2(e) {
            return new D(3402, !1);
          })();
        }
        _flushAnimations(t, n) {
          const r = new Al(),
            i = [],
            o = new Map(),
            s = [],
            a = new Map(),
            l = new Map(),
            u = new Map(),
            c = new Set();
          this.disabledNodes.forEach(R => {
            c.add(R);
            const O = this.driver.query(R, ".ng-animate-queued", !0);
            for (let B = 0; B < O.length; B++) c.add(O[B]);
          });
          const d = this.bodyNode,
            f = Array.from(this.statesByElement.keys()),
            h = EC(f, this.collectedEnterElements),
            p = new Map();
          let g = 0;
          h.forEach((R, O) => {
            const B = rh + g++;
            p.set(O, B), R.forEach(X => Ft(X, B));
          });
          const y = [],
            v = new Set(),
            m = new Set();
          for (let R = 0; R < this.collectedLeaveElements.length; R++) {
            const O = this.collectedLeaveElements[R],
              B = O[Ot];
            B &&
              B.setForRemoval &&
              (y.push(O),
              v.add(O),
              B.hasAnimation ? this.driver.query(O, ".ng-star-inserted", !0).forEach(X => v.add(X)) : m.add(O));
          }
          const C = new Map(),
            T = EC(f, Array.from(v));
          T.forEach((R, O) => {
            const B = wl + g++;
            C.set(O, B), R.forEach(X => Ft(X, B));
          }),
            t.push(() => {
              h.forEach((R, O) => {
                const B = p.get(O);
                R.forEach(X => xi(X, B));
              }),
                T.forEach((R, O) => {
                  const B = C.get(O);
                  R.forEach(X => xi(X, B));
                }),
                y.forEach(R => {
                  this.processLeaveNode(R);
                });
            });
          const x = [],
            de = [];
          for (let R = this._namespaceList.length - 1; R >= 0; R--)
            this._namespaceList[R].drainQueuedTransitions(n).forEach(B => {
              const X = B.player,
                ke = B.element;
              if ((x.push(X), this.collectedEnterElements.length)) {
                const We = ke[Ot];
                if (We && We.setForMove) {
                  if (We.previousTriggersValues && We.previousTriggersValues.has(B.triggerName)) {
                    const Rr = We.previousTriggersValues.get(B.triggerName),
                      kt = this.statesByElement.get(B.element);
                    if (kt && kt.has(B.triggerName)) {
                      const Fl = kt.get(B.triggerName);
                      (Fl.value = Rr), kt.set(B.triggerName, Fl);
                    }
                  }
                  return void X.destroy();
                }
              }
              const mn = !d || !this.driver.containsElement(d, ke),
                bt = C.get(ke),
                tr = p.get(ke),
                me = this._buildInstruction(B, r, tr, bt, mn);
              if (me.errors && me.errors.length) return void de.push(me);
              if (mn)
                return X.onStart(() => Ir(ke, me.fromStyles)), X.onDestroy(() => gn(ke, me.toStyles)), void i.push(X);
              if (B.isFallbackTransition)
                return X.onStart(() => Ir(ke, me.fromStyles)), X.onDestroy(() => gn(ke, me.toStyles)), void i.push(X);
              const OC = [];
              me.timelines.forEach(We => {
                (We.stretchStartingKeyframe = !0), this.disabledNodes.has(We.element) || OC.push(We);
              }),
                (me.timelines = OC),
                r.append(ke, me.timelines),
                s.push({ instruction: me, player: X, element: ke }),
                me.queriedElements.forEach(We => Et(a, We, []).push(X)),
                me.preStyleProps.forEach((We, Rr) => {
                  if (We.size) {
                    let kt = l.get(Rr);
                    kt || l.set(Rr, (kt = new Set())), We.forEach((Fl, wh) => kt.add(wh));
                  }
                }),
                me.postStyleProps.forEach((We, Rr) => {
                  let kt = u.get(Rr);
                  kt || u.set(Rr, (kt = new Set())), We.forEach((Fl, wh) => kt.add(wh));
                });
            });
          if (de.length) {
            const R = [];
            de.forEach(O => {
              R.push(
                (function L2(e, t) {
                  return new D(3505, !1);
                })()
              );
            }),
              x.forEach(O => O.destroy()),
              this.reportError(R);
          }
          const Ie = new Map(),
            Zt = new Map();
          s.forEach(R => {
            const O = R.element;
            r.has(O) && (Zt.set(O, O), this._beforeAnimationBuild(R.player.namespaceId, R.instruction, Ie));
          }),
            i.forEach(R => {
              const O = R.element;
              this._getPreviousPlayers(O, !1, R.namespaceId, R.triggerName, null).forEach(X => {
                Et(Ie, O, []).push(X), X.destroy();
              });
            });
          const jn = y.filter(R => bC(R, l, u)),
            Bn = new Map();
          wC(Bn, this.driver, m, u, kn).forEach(R => {
            bC(R, l, u) && jn.push(R);
          });
          const ls = new Map();
          h.forEach((R, O) => {
            wC(ls, this.driver, new Set(R), l, Yf);
          }),
            jn.forEach(R => {
              const O = Bn.get(R),
                B = ls.get(R);
              Bn.set(R, new Map([...(O?.entries() ?? []), ...(B?.entries() ?? [])]));
            });
          const Nr = [],
            PC = [],
            xC = {};
          s.forEach(R => {
            const { element: O, player: B, instruction: X } = R;
            if (r.has(O)) {
              if (c.has(O))
                return (
                  B.onDestroy(() => gn(O, X.toStyles)),
                  (B.disabled = !0),
                  B.overrideTotalTime(X.totalTime),
                  void i.push(B)
                );
              let ke = xC;
              if (Zt.size > 1) {
                let bt = O;
                const tr = [];
                for (; (bt = bt.parentNode); ) {
                  const me = Zt.get(bt);
                  if (me) {
                    ke = me;
                    break;
                  }
                  tr.push(bt);
                }
                tr.forEach(me => Zt.set(me, ke));
              }
              const mn = this._buildAnimation(B.namespaceId, X, Ie, o, ls, Bn);
              if ((B.setRealPlayer(mn), ke === xC)) Nr.push(B);
              else {
                const bt = this.playersByElement.get(ke);
                bt && bt.length && (B.parentPlayer = Jn(bt)), i.push(B);
              }
            } else Ir(O, X.fromStyles), B.onDestroy(() => gn(O, X.toStyles)), PC.push(B), c.has(O) && i.push(B);
          }),
            PC.forEach(R => {
              const O = o.get(R.element);
              if (O && O.length) {
                const B = Jn(O);
                R.setRealPlayer(B);
              }
            }),
            i.forEach(R => {
              R.parentPlayer ? R.syncPlayerEvents(R.parentPlayer) : R.destroy();
            });
          for (let R = 0; R < y.length; R++) {
            const O = y[R],
              B = O[Ot];
            if ((xi(O, wl), B && B.hasAnimation)) continue;
            let X = [];
            if (a.size) {
              let mn = a.get(O);
              mn && mn.length && X.push(...mn);
              let bt = this.driver.query(O, ih, !0);
              for (let tr = 0; tr < bt.length; tr++) {
                let me = a.get(bt[tr]);
                me && me.length && X.push(...me);
              }
            }
            const ke = X.filter(mn => !mn.destroyed);
            ke.length ? kj(this, O, ke) : this.processLeaveNode(O);
          }
          return (
            (y.length = 0),
            Nr.forEach(R => {
              this.players.push(R),
                R.onDone(() => {
                  R.destroy();
                  const O = this.players.indexOf(R);
                  this.players.splice(O, 1);
                }),
                R.play();
            }),
            Nr
          );
        }
        elementContainsData(t, n) {
          let r = !1;
          const i = n[Ot];
          return (
            i && i.setForRemoval && (r = !0),
            this.playersByElement.has(n) && (r = !0),
            this.playersByQueriedElement.has(n) && (r = !0),
            this.statesByElement.has(n) && (r = !0),
            this._fetchNamespace(t).elementContainsData(n) || r
          );
        }
        afterFlush(t) {
          this._flushFns.push(t);
        }
        afterFlushAnimationsDone(t) {
          this._whenQuietFns.push(t);
        }
        _getPreviousPlayers(t, n, r, i, o) {
          let s = [];
          if (n) {
            const a = this.playersByQueriedElement.get(t);
            a && (s = a);
          } else {
            const a = this.playersByElement.get(t);
            if (a) {
              const l = !o || o == as;
              a.forEach(u => {
                u.queued || (!l && u.triggerName != i) || s.push(u);
              });
            }
          }
          return (r || i) && (s = s.filter(a => !((r && r != a.namespaceId) || (i && i != a.triggerName)))), s;
        }
        _beforeAnimationBuild(t, n, r) {
          const o = n.element,
            s = n.isRemovalTransition ? void 0 : t,
            a = n.isRemovalTransition ? void 0 : n.triggerName;
          for (const l of n.timelines) {
            const u = l.element,
              c = u !== o,
              d = Et(r, u, []);
            this._getPreviousPlayers(u, c, s, a, n.toState).forEach(h => {
              const p = h.getRealPlayer();
              p.beforeDestroy && p.beforeDestroy(), h.destroy(), d.push(h);
            });
          }
          Ir(o, n.fromStyles);
        }
        _buildAnimation(t, n, r, i, o, s) {
          const a = n.triggerName,
            l = n.element,
            u = [],
            c = new Set(),
            d = new Set(),
            f = n.timelines.map(p => {
              const g = p.element;
              c.add(g);
              const y = g[Ot];
              if (y && y.removedBeforeQueried) return new rs(p.duration, p.delay);
              const v = g !== l,
                m = (function Lj(e) {
                  const t = [];
                  return CC(e, t), t;
                })((r.get(g) || Aj).map(Ie => Ie.getRealPlayer())).filter(Ie => !!Ie.element && Ie.element === g),
                C = o.get(g),
                T = s.get(g),
                x = JE(this._normalizer, p.keyframes, C, T),
                de = this._buildPlayer(p, x, m);
              if ((p.subTimeline && i && d.add(g), v)) {
                const Ie = new vh(t, a, g);
                Ie.setRealPlayer(de), u.push(Ie);
              }
              return de;
            });
          u.forEach(p => {
            Et(this.playersByQueriedElement, p.element, []).push(p),
              p.onDone(() =>
                (function xj(e, t, n) {
                  let r = e.get(t);
                  if (r) {
                    if (r.length) {
                      const i = r.indexOf(n);
                      r.splice(i, 1);
                    }
                    0 == r.length && e.delete(t);
                  }
                  return r;
                })(this.playersByQueriedElement, p.element, p)
              );
          }),
            c.forEach(p => Ft(p, sC));
          const h = Jn(f);
          return (
            h.onDestroy(() => {
              c.forEach(p => xi(p, sC)), gn(l, n.toStyles);
            }),
            d.forEach(p => {
              Et(i, p, []).push(h);
            }),
            h
          );
        }
        _buildPlayer(t, n, r) {
          return n.length > 0
            ? this.driver.animate(t.element, n, t.duration, t.delay, t.easing, r)
            : new rs(t.duration, t.delay);
        }
      }
      class vh {
        constructor(t, n, r) {
          (this.namespaceId = t),
            (this.triggerName = n),
            (this.element = r),
            (this._player = new rs()),
            (this._containsRealPlayer = !1),
            (this._queuedCallbacks = new Map()),
            (this.destroyed = !1),
            (this.parentPlayer = null),
            (this.markedForDestroy = !1),
            (this.disabled = !1),
            (this.queued = !0),
            (this.totalTime = 0);
        }
        setRealPlayer(t) {
          this._containsRealPlayer ||
            ((this._player = t),
            this._queuedCallbacks.forEach((n, r) => {
              n.forEach(i => Xf(t, r, void 0, i));
            }),
            this._queuedCallbacks.clear(),
            (this._containsRealPlayer = !0),
            this.overrideTotalTime(t.totalTime),
            (this.queued = !1));
        }
        getRealPlayer() {
          return this._player;
        }
        overrideTotalTime(t) {
          this.totalTime = t;
        }
        syncPlayerEvents(t) {
          const n = this._player;
          n.triggerCallback && t.onStart(() => n.triggerCallback("start")),
            t.onDone(() => this.finish()),
            t.onDestroy(() => this.destroy());
        }
        _queueEvent(t, n) {
          Et(this._queuedCallbacks, t, []).push(n);
        }
        onDone(t) {
          this.queued && this._queueEvent("done", t), this._player.onDone(t);
        }
        onStart(t) {
          this.queued && this._queueEvent("start", t), this._player.onStart(t);
        }
        onDestroy(t) {
          this.queued && this._queueEvent("destroy", t), this._player.onDestroy(t);
        }
        init() {
          this._player.init();
        }
        hasStarted() {
          return !this.queued && this._player.hasStarted();
        }
        play() {
          !this.queued && this._player.play();
        }
        pause() {
          !this.queued && this._player.pause();
        }
        restart() {
          !this.queued && this._player.restart();
        }
        finish() {
          this._player.finish();
        }
        destroy() {
          (this.destroyed = !0), this._player.destroy();
        }
        reset() {
          !this.queued && this._player.reset();
        }
        setPosition(t) {
          this.queued || this._player.setPosition(t);
        }
        getPosition() {
          return this.queued ? 0 : this._player.getPosition();
        }
        triggerCallback(t) {
          const n = this._player;
          n.triggerCallback && n.triggerCallback(t);
        }
      }
      function Pl(e) {
        return e && 1 === e.nodeType;
      }
      function _C(e, t) {
        const n = e.style.display;
        return (e.style.display = t ?? "none"), n;
      }
      function wC(e, t, n, r, i) {
        const o = [];
        n.forEach(l => o.push(_C(l)));
        const s = [];
        r.forEach((l, u) => {
          const c = new Map();
          l.forEach(d => {
            const f = t.computeStyle(u, d, i);
            c.set(d, f), (!f || 0 == f.length) && ((u[Ot] = Nj), s.push(u));
          }),
            e.set(u, c);
        });
        let a = 0;
        return n.forEach(l => _C(l, o[a++])), s;
      }
      function EC(e, t) {
        const n = new Map();
        if ((e.forEach(a => n.set(a, [])), 0 == t.length)) return n;
        const r = 1,
          i = new Set(t),
          o = new Map();
        function s(a) {
          if (!a) return r;
          let l = o.get(a);
          if (l) return l;
          const u = a.parentNode;
          return (l = n.has(u) ? u : i.has(u) ? r : s(u)), o.set(a, l), l;
        }
        return (
          t.forEach(a => {
            const l = s(a);
            l !== r && n.get(l).push(a);
          }),
          n
        );
      }
      function Ft(e, t) {
        e.classList?.add(t);
      }
      function xi(e, t) {
        e.classList?.remove(t);
      }
      function kj(e, t, n) {
        Jn(n).onDone(() => e.processLeaveNode(t));
      }
      function CC(e, t) {
        for (let n = 0; n < e.length; n++) {
          const r = e[n];
          r instanceof YE ? CC(r.players, t) : t.push(r);
        }
      }
      function bC(e, t, n) {
        const r = n.get(e);
        if (!r) return !1;
        let i = t.get(e);
        return i ? r.forEach(o => i.add(o)) : t.set(e, r), n.delete(e), !0;
      }
      class xl {
        constructor(t, n, r) {
          (this.bodyNode = t),
            (this._driver = n),
            (this._normalizer = r),
            (this._triggerCache = {}),
            (this.onRemovalComplete = (i, o) => {}),
            (this._transitionEngine = new Pj(t, n, r)),
            (this._timelineEngine = new bj(t, n, r)),
            (this._transitionEngine.onRemovalComplete = (i, o) => this.onRemovalComplete(i, o));
        }
        registerTrigger(t, n, r, i, o) {
          const s = t + "-" + i;
          let a = this._triggerCache[s];
          if (!a) {
            const l = [],
              c = lh(this._driver, o, l, []);
            if (l.length)
              throw (function M2(e, t) {
                return new D(3404, !1);
              })();
            (a = (function _j(e, t, n) {
              return new wj(e, t, n);
            })(i, c, this._normalizer)),
              (this._triggerCache[s] = a);
          }
          this._transitionEngine.registerTrigger(n, i, a);
        }
        register(t, n) {
          this._transitionEngine.register(t, n);
        }
        destroy(t, n) {
          this._transitionEngine.destroy(t, n);
        }
        onInsert(t, n, r, i) {
          this._transitionEngine.insertNode(t, n, r, i);
        }
        onRemove(t, n, r, i) {
          this._transitionEngine.removeNode(t, n, i || !1, r);
        }
        disableAnimations(t, n) {
          this._transitionEngine.markElementAsDisabled(t, n);
        }
        process(t, n, r, i) {
          if ("@" == r.charAt(0)) {
            const [o, s] = eC(r);
            this._timelineEngine.command(o, n, s, i);
          } else this._transitionEngine.trigger(t, n, r, i);
        }
        listen(t, n, r, i, o) {
          if ("@" == r.charAt(0)) {
            const [s, a] = eC(r);
            return this._timelineEngine.listen(s, n, a, o);
          }
          return this._transitionEngine.listen(t, n, r, i, o);
        }
        flush(t = -1) {
          this._transitionEngine.flush(t);
        }
        get players() {
          return this._transitionEngine.players.concat(this._timelineEngine.players);
        }
        whenRenderingDone() {
          return this._transitionEngine.whenRenderingDone();
        }
      }
      let Vj = (() => {
        class e {
          constructor(n, r, i) {
            (this._element = n), (this._startStyles = r), (this._endStyles = i), (this._state = 0);
            let o = e.initialStylesByElement.get(n);
            o || e.initialStylesByElement.set(n, (o = new Map())), (this._initialStyles = o);
          }
          start() {
            this._state < 1 &&
              (this._startStyles && gn(this._element, this._startStyles, this._initialStyles), (this._state = 1));
          }
          finish() {
            this.start(),
              this._state < 2 &&
                (gn(this._element, this._initialStyles),
                this._endStyles && (gn(this._element, this._endStyles), (this._endStyles = null)),
                (this._state = 1));
          }
          destroy() {
            this.finish(),
              this._state < 3 &&
                (e.initialStylesByElement.delete(this._element),
                this._startStyles && (Ir(this._element, this._startStyles), (this._endStyles = null)),
                this._endStyles && (Ir(this._element, this._endStyles), (this._endStyles = null)),
                gn(this._element, this._initialStyles),
                (this._state = 3));
          }
        }
        return (e.initialStylesByElement = new WeakMap()), e;
      })();
      function Dh(e) {
        let t = null;
        return (
          e.forEach((n, r) => {
            (function Hj(e) {
              return "display" === e || "position" === e;
            })(r) && ((t = t || new Map()), t.set(r, n));
          }),
          t
        );
      }
      class SC {
        constructor(t, n, r, i) {
          (this.element = t),
            (this.keyframes = n),
            (this.options = r),
            (this._specialStyles = i),
            (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._initialized = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this.time = 0),
            (this.parentPlayer = null),
            (this.currentSnapshot = new Map()),
            (this._duration = r.duration),
            (this._delay = r.delay || 0),
            (this.time = this._duration + this._delay);
        }
        _onFinish() {
          this._finished || ((this._finished = !0), this._onDoneFns.forEach(t => t()), (this._onDoneFns = []));
        }
        init() {
          this._buildPlayer(), this._preparePlayerBeforeStart();
        }
        _buildPlayer() {
          if (this._initialized) return;
          this._initialized = !0;
          const t = this.keyframes;
          (this.domPlayer = this._triggerWebAnimation(this.element, t, this.options)),
            (this._finalKeyframe = t.length ? t[t.length - 1] : new Map()),
            this.domPlayer.addEventListener("finish", () => this._onFinish());
        }
        _preparePlayerBeforeStart() {
          this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
        }
        _convertKeyframesToObject(t) {
          const n = [];
          return (
            t.forEach(r => {
              n.push(Object.fromEntries(r));
            }),
            n
          );
        }
        _triggerWebAnimation(t, n, r) {
          return t.animate(this._convertKeyframesToObject(n), r);
        }
        onStart(t) {
          this._originalOnStartFns.push(t), this._onStartFns.push(t);
        }
        onDone(t) {
          this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        play() {
          this._buildPlayer(),
            this.hasStarted() ||
              (this._onStartFns.forEach(t => t()),
              (this._onStartFns = []),
              (this._started = !0),
              this._specialStyles && this._specialStyles.start()),
            this.domPlayer.play();
        }
        pause() {
          this.init(), this.domPlayer.pause();
        }
        finish() {
          this.init(), this._specialStyles && this._specialStyles.finish(), this._onFinish(), this.domPlayer.finish();
        }
        reset() {
          this._resetDomPlayerState(),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        _resetDomPlayerState() {
          this.domPlayer && this.domPlayer.cancel();
        }
        restart() {
          this.reset(), this.play();
        }
        hasStarted() {
          return this._started;
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._resetDomPlayerState(),
            this._onFinish(),
            this._specialStyles && this._specialStyles.destroy(),
            this._onDestroyFns.forEach(t => t()),
            (this._onDestroyFns = []));
        }
        setPosition(t) {
          void 0 === this.domPlayer && this.init(), (this.domPlayer.currentTime = t * this.time);
        }
        getPosition() {
          return this.domPlayer.currentTime / this.time;
        }
        get totalTime() {
          return this._delay + this._duration;
        }
        beforeDestroy() {
          const t = new Map();
          this.hasStarted() &&
            this._finalKeyframe.forEach((r, i) => {
              "offset" !== i && t.set(i, this._finished ? r : cC(this.element, i));
            }),
            (this.currentSnapshot = t);
        }
        triggerCallback(t) {
          const n = "start" === t ? this._onStartFns : this._onDoneFns;
          n.forEach(r => r()), (n.length = 0);
        }
      }
      class $j {
        validateStyleProperty(t) {
          return !0;
        }
        validateAnimatableStyleProperty(t) {
          return !0;
        }
        matchesElement(t, n) {
          return !1;
        }
        containsElement(t, n) {
          return nC(t, n);
        }
        getParentElement(t) {
          return th(t);
        }
        query(t, n, r) {
          return rC(t, n, r);
        }
        computeStyle(t, n, r) {
          return window.getComputedStyle(t)[n];
        }
        animate(t, n, r, i, o, s = []) {
          const l = { duration: r, delay: i, fill: 0 == i ? "both" : "forwards" };
          o && (l.easing = o);
          const u = new Map(),
            c = s.filter(h => h instanceof SC);
          (function Q2(e, t) {
            return 0 === e || 0 === t;
          })(r, i) &&
            c.forEach(h => {
              h.currentSnapshot.forEach((p, g) => u.set(g, p));
            });
          let d = (function G2(e) {
            return e.length ? (e[0] instanceof Map ? e : e.map(t => aC(t))) : [];
          })(n).map(h => er(h));
          d = (function Z2(e, t, n) {
            if (n.size && t.length) {
              let r = t[0],
                i = [];
              if (
                (n.forEach((o, s) => {
                  r.has(s) || i.push(s), r.set(s, o);
                }),
                i.length)
              )
                for (let o = 1; o < t.length; o++) {
                  let s = t[o];
                  i.forEach(a => s.set(a, cC(e, a)));
                }
            }
            return t;
          })(t, d, u);
          const f = (function Bj(e, t) {
            let n = null,
              r = null;
            return (
              Array.isArray(t) && t.length
                ? ((n = Dh(t[0])), t.length > 1 && (r = Dh(t[t.length - 1])))
                : t instanceof Map && (n = Dh(t)),
              n || r ? new Vj(e, n, r) : null
            );
          })(t, d);
          return new SC(t, d, l, f);
        }
      }
      let Uj = (() => {
        class e extends WE {
          constructor(n, r) {
            super(),
              (this._nextAnimationId = 0),
              (this._renderer = n.createRenderer(r.body, {
                id: "0",
                encapsulation: nt.None,
                styles: [],
                data: { animation: [] },
              }));
          }
          build(n) {
            const r = this._nextAnimationId.toString();
            this._nextAnimationId++;
            const i = Array.isArray(n) ? KE(n) : n;
            return MC(this._renderer, null, r, "register", [i]), new zj(r, this._renderer);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(fo), M(et));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class zj extends i2 {
        constructor(t, n) {
          super(), (this._id = t), (this._renderer = n);
        }
        create(t, n) {
          return new qj(this._id, t, n || {}, this._renderer);
        }
      }
      class qj {
        constructor(t, n, r, i) {
          (this.id = t),
            (this.element = n),
            (this._renderer = i),
            (this.parentPlayer = null),
            (this._started = !1),
            (this.totalTime = 0),
            this._command("create", r);
        }
        _listen(t, n) {
          return this._renderer.listen(this.element, `@@${this.id}:${t}`, n);
        }
        _command(t, ...n) {
          return MC(this._renderer, this.element, this.id, t, n);
        }
        onDone(t) {
          this._listen("done", t);
        }
        onStart(t) {
          this._listen("start", t);
        }
        onDestroy(t) {
          this._listen("destroy", t);
        }
        init() {
          this._command("init");
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this._command("play"), (this._started = !0);
        }
        pause() {
          this._command("pause");
        }
        restart() {
          this._command("restart");
        }
        finish() {
          this._command("finish");
        }
        destroy() {
          this._command("destroy");
        }
        reset() {
          this._command("reset"), (this._started = !1);
        }
        setPosition(t) {
          this._command("setPosition", t);
        }
        getPosition() {
          return this._renderer.engine.players[+this.id]?.getPosition() ?? 0;
        }
      }
      function MC(e, t, n, r, i) {
        return e.setProperty(t, `@@${n}:${r}`, i);
      }
      const TC = "@.disabled";
      let Gj = (() => {
        class e {
          constructor(n, r, i) {
            (this.delegate = n),
              (this.engine = r),
              (this._zone = i),
              (this._currentId = 0),
              (this._microtaskId = 1),
              (this._animationCallbacksBuffer = []),
              (this._rendererCache = new Map()),
              (this._cdRecurDepth = 0),
              (this.promise = Promise.resolve(0)),
              (r.onRemovalComplete = (o, s) => {
                const a = s?.parentNode(o);
                a && s.removeChild(a, o);
              });
          }
          createRenderer(n, r) {
            const o = this.delegate.createRenderer(n, r);
            if (!(n && r && r.data && r.data.animation)) {
              let c = this._rendererCache.get(o);
              return (
                c ||
                  ((c = new IC("", o, this.engine, () => this._rendererCache.delete(o))),
                  this._rendererCache.set(o, c)),
                c
              );
            }
            const s = r.id,
              a = r.id + "-" + this._currentId;
            this._currentId++, this.engine.register(a, n);
            const l = c => {
              Array.isArray(c) ? c.forEach(l) : this.engine.registerTrigger(s, a, n, c.name, c);
            };
            return r.data.animation.forEach(l), new Wj(this, a, o, this.engine);
          }
          begin() {
            this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
          }
          _scheduleCountTask() {
            this.promise.then(() => {
              this._microtaskId++;
            });
          }
          scheduleListenerCallback(n, r, i) {
            n >= 0 && n < this._microtaskId
              ? this._zone.run(() => r(i))
              : (0 == this._animationCallbacksBuffer.length &&
                  Promise.resolve(null).then(() => {
                    this._zone.run(() => {
                      this._animationCallbacksBuffer.forEach(o => {
                        const [s, a] = o;
                        s(a);
                      }),
                        (this._animationCallbacksBuffer = []);
                    });
                  }),
                this._animationCallbacksBuffer.push([r, i]));
          }
          end() {
            this._cdRecurDepth--,
              0 == this._cdRecurDepth &&
                this._zone.runOutsideAngular(() => {
                  this._scheduleCountTask(), this.engine.flush(this._microtaskId);
                }),
              this.delegate.end && this.delegate.end();
          }
          whenRenderingDone() {
            return this.engine.whenRenderingDone();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(M(fo), M(xl), M(ue));
          }),
          (e.ɵprov = P({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class IC {
        constructor(t, n, r, i) {
          (this.namespaceId = t),
            (this.delegate = n),
            (this.engine = r),
            (this._onDestroy = i),
            (this.destroyNode = this.delegate.destroyNode ? o => n.destroyNode(o) : null);
        }
        get data() {
          return this.delegate.data;
        }
        destroy() {
          this.engine.destroy(this.namespaceId, this.delegate), this.delegate.destroy(), this._onDestroy?.();
        }
        createElement(t, n) {
          return this.delegate.createElement(t, n);
        }
        createComment(t) {
          return this.delegate.createComment(t);
        }
        createText(t) {
          return this.delegate.createText(t);
        }
        appendChild(t, n) {
          this.delegate.appendChild(t, n), this.engine.onInsert(this.namespaceId, n, t, !1);
        }
        insertBefore(t, n, r, i = !0) {
          this.delegate.insertBefore(t, n, r), this.engine.onInsert(this.namespaceId, n, t, i);
        }
        removeChild(t, n, r) {
          this.engine.onRemove(this.namespaceId, n, this.delegate, r);
        }
        selectRootElement(t, n) {
          return this.delegate.selectRootElement(t, n);
        }
        parentNode(t) {
          return this.delegate.parentNode(t);
        }
        nextSibling(t) {
          return this.delegate.nextSibling(t);
        }
        setAttribute(t, n, r, i) {
          this.delegate.setAttribute(t, n, r, i);
        }
        removeAttribute(t, n, r) {
          this.delegate.removeAttribute(t, n, r);
        }
        addClass(t, n) {
          this.delegate.addClass(t, n);
        }
        removeClass(t, n) {
          this.delegate.removeClass(t, n);
        }
        setStyle(t, n, r, i) {
          this.delegate.setStyle(t, n, r, i);
        }
        removeStyle(t, n, r) {
          this.delegate.removeStyle(t, n, r);
        }
        setProperty(t, n, r) {
          "@" == n.charAt(0) && n == TC ? this.disableAnimations(t, !!r) : this.delegate.setProperty(t, n, r);
        }
        setValue(t, n) {
          this.delegate.setValue(t, n);
        }
        listen(t, n, r) {
          return this.delegate.listen(t, n, r);
        }
        disableAnimations(t, n) {
          this.engine.disableAnimations(t, n);
        }
      }
      class Wj extends IC {
        constructor(t, n, r, i, o) {
          super(n, r, i, o), (this.factory = t), (this.namespaceId = n);
        }
        setProperty(t, n, r) {
          "@" == n.charAt(0)
            ? "." == n.charAt(1) && n == TC
              ? this.disableAnimations(t, (r = void 0 === r || !!r))
              : this.engine.process(this.namespaceId, t, n.slice(1), r)
            : this.delegate.setProperty(t, n, r);
        }
        listen(t, n, r) {
          if ("@" == n.charAt(0)) {
            const i = (function Kj(e) {
              switch (e) {
                case "body":
                  return document.body;
                case "document":
                  return document;
                case "window":
                  return window;
                default:
                  return e;
              }
            })(t);
            let o = n.slice(1),
              s = "";
            return (
              "@" != o.charAt(0) &&
                ([o, s] = (function Qj(e) {
                  const t = e.indexOf(".");
                  return [e.substring(0, t), e.slice(t + 1)];
                })(o)),
              this.engine.listen(this.namespaceId, i, o, s, a => {
                this.factory.scheduleListenerCallback(a._data || -1, r, a);
              })
            );
          }
          return this.delegate.listen(t, n, r);
        }
      }
      const AC = [
          { provide: WE, useClass: Uj },
          {
            provide: hh,
            useFactory: function Yj() {
              return new mj();
            },
          },
          {
            provide: xl,
            useClass: (() => {
              class e extends xl {
                constructor(n, r, i, o) {
                  super(n.body, r, i);
                }
                ngOnDestroy() {
                  this.flush();
                }
              }
              return (
                (e.ɵfac = function (n) {
                  return new (n || e)(M(et), M(nh), M(hh), M(Dr));
                }),
                (e.ɵprov = P({ token: e, factory: e.ɵfac })),
                e
              );
            })(),
          },
          {
            provide: fo,
            useFactory: function Xj(e, t, n) {
              return new Gj(e, t, n);
            },
            deps: [mf, xl, ue],
          },
        ],
        _h = [{ provide: nh, useFactory: () => new $j() }, { provide: hm, useValue: "BrowserAnimations" }, ...AC],
        NC = [{ provide: nh, useClass: iC }, { provide: hm, useValue: "NoopAnimations" }, ...AC];
      let Jj = (() => {
          class e {
            static withConfig(n) {
              return { ngModule: e, providers: n.disableAnimations ? NC : _h };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = en({ type: e })),
            (e.ɵinj = jt({ providers: _h, imports: [yw] })),
            e
          );
        })(),
        e3 = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = en({ type: e })),
            (e.ɵinj = jt({ providers: [qE, IE, GE], imports: [Z_, IL] })),
            e
          );
        })();
      const t3 = { API_BASE_URL: "https://techincent.com/wp-json/wp" };
      let n3 = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = en({ type: e, bootstrap: [r2] })),
          (e.ɵinj = jt({ providers: [{ provide: zE, useValue: t3 }], imports: [yw, iL, Jj, e3] })),
          e
        );
      })();
      mO()
        .bootstrapModule(n3)
        .catch(e => console.error(e));
    },
  },
  se => {
    se((se.s = 957));
  },
]);
