'use strict'

const BlankNode = require('./BlankNode')
const DataFactory = require('rdf-data-model')
const Dataset = require('./Dataset')
const DefaultGraph = require('./DefaultGraph')
const Literal = require('./Literal')
const NamedNode = require('./NamedNode')
const PrefixMap = require('./PrefixMap')
const Quad = require('./Quad')
const Variable = require('./Variable')

/**
 * Factory for creating RDF elements.
 * See also : {@link https://github.com/rdfjs/representation-task-force/blob/master/interface-spec.md#datafactory DataFactory interface specification}
 * @extends DataFactory
 */
class DataFactoryExt extends DataFactory {
  static namedNode (value) {
    return new DataFactoryExt.defaults.NamedNode(value)
  }

  /**
   * Create a new {@link BlankNodeExt BlankNode}. If the value parameter is undefined a new identifier for the blank node is generated for each call.
   * @param {string} value an identifier for the {@link BlankNodeExt BlankNode}
   * @return {BlankNode} A new instance of {@link BlankNodeExt BlankNode}.
   */
  static blankNode (value) {
    return new DataFactoryExt.defaults.BlankNode(value)
  }

  /**
   * Create a new {@link LiteralExt Literal}.
   * @param {string} value the text value of the Literal
   * @param {(string|NamedNode)} languageOrDatatype either the language as lowercase BCP47 string (examples: en, en-gb) or a {@link NamedNodeExt NamedNode} whose IRI represents the datatype of the literal
   * @return {Literal} A new instance of Literal
   */
  static literal (value, languageOrDatatype) {
    if (typeof languageOrDatatype === 'string') {
      if (languageOrDatatype.indexOf(':') === -1) {
        return new DataFactoryExt.defaults.Literal(value, languageOrDatatype)
      } else {
        return new DataFactoryExt.defaults.Literal(value, null, DataFactory.namedNode(languageOrDatatype))
      }
    } else {
      return new DataFactoryExt.defaults.Literal(value, null, languageOrDatatype)
    }
  }

  /**
   * Create a new {@link VariableExt Variable}.
   * @param {string} value the name of the Variable
   * @return {Literal} A new instance of Variable.
   */
  static variable (value) {
    return new DataFactoryExt.defaults.Variable(value)
  }

  /**
   * Create a new {@link DefaultGraphExt DefaultGraph}.
   * @return {DefaultGraph} A new instance of DefaultGraph.
   */
  static defaultGraph () {
    return DataFactoryExt.defaults.defaultGraph
  }

  /**
   * Create a new triple (alias of {@link QuadExt Quad}) in the {@link DefaultGraphExt DefaultGraph}.
   * @param {(NamedNode|BlankNode|Variable)} subject the subject of the triple
   * @param {NamedNode|Variable} predicate the predicate of the triple
   * @param {(NamedNode|BlankNode|Literal|Variable)} object the object of the triple
   * @return {Quad} A new instance of Quad.
   */
  static triple (subject, predicate, object) {
    return DataFactoryExt.quad(subject, predicate, object)
  }

  /**
   * Create a new {@link QuadExt Quad}.
   * @param {(NamedNode|BlankNode|Variable)} subject the subject of the Quad
   * @param {(NamedNode|Variable)} predicate the predicate of the Quad
   * @param {(NamedNode|BlankNode|Literal|Variable)} object the object of the Quad TODO: Can take a string?
   * @param {(DefaultGraph|NamedNode|BlankNode|Variable)} graph the graph of the specified triple (in no graph is specified, {@link DefaultGraphExt DefaultGraph} is used)
   * @return {Quad} A new instance of Quad.
   */
  static quad (subject, predicate, object, graph) {
    return new DataFactoryExt.defaults.Quad(subject, predicate, object, graph || DataFactoryExt.defaults.defaultGraph)
  }

  /**
   * Create a new graph, ie. {@link DatasetExt Dataset}.
   * @param {(NamedNode|BlankNode)} subject the subject of the Quad
   * @param {NamedNode} predicate the predicate of the Quad
   * @param {(NamedNode|BlankNode|Literal)} object the object of the Quad TODO: Can take a string?
   * @param {(NamedNode|BlankNode)} graph the graph of the specified triple (in no graph is specified, DefaultGraph is used)
   * @return {Dataset} A new graph.
   */
  static graph (quads) {
    let dataset = new DataFactoryExt.defaults.Dataset()

    if (quads) {
      quads.forEach((quad) => {
        dataset.add(DataFactoryExt.quad(quad.subject, quad.predicate, quad.object))
      })
    }

    return dataset
  }

  static dataset (quads, graph) {
    let dataset = new DataFactoryExt.defaults.Dataset()

    if (quads) {
      if (graph) {
        quads.forEach((quad) => {
          dataset.add(DataFactoryExt.quad(
            quad.subject,
            quad.predicate,
            quad.object,
            graph
          ))
        })
      } else {
        dataset.addAll(quads)
      }
    }

    return dataset
  }

  static prefixMap (prefixes) {
    return new DataFactoryExt.defaults.PrefixMap(this, prefixes)
  }
}

DataFactoryExt.defaults = {
  defaultGraph: new DefaultGraph(),
  NamedNode: NamedNode,
  BlankNode: BlankNode,
  Literal: Literal,
  Variable: Variable,
  Quad: Quad,
  Dataset: Dataset,
  PrefixMap: PrefixMap
}

Dataset.factory = DataFactoryExt

module.exports = DataFactoryExt
